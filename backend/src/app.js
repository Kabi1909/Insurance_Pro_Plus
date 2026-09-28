import { prepareCheckout, settlePayment } from './payments.js';
import { serveFrontend } from './static.js';
import { fileURLToPath } from 'node:url';
import { requireWrite } from './permissions.js';
import { createServer } from 'node:http';
import { createStore } from './store.js';
import { products, defaultSettings } from './catalog.js';
import { id, token, digest, fail, text, email, amount, password, hashPassword, verifyPassword, publicUser } from './security.js';
import { verifyNotification } from './payhere.js';
import { pdf } from './pdf.js';

const now = () => new Date().toISOString();
const roles=['System Administrator','Claims Officer','Claims Manager','Finance Officer','Support Officer','Policy Officer'];
const money = n => '$'+Number(n || 0).toLocaleString('en-US',{maximumFractionDigits:2});
const safeNote = (user, value) => ({id:id('NOTE'),text:text(value,'Message',1,4000),author:user.name,time:now()});

export async function createApp(options = {}) {
  const config={ database:process.env.DATABASE_PATH || 'data/insurance.sqlite', origin:process.env.APP_ORIGIN || 'http://localhost:5173',
    frontendDist:process.env.FRONTEND_DIST || fileURLToPath(new URL('../../frontend/dist',import.meta.url)),
    production:process.env.NODE_ENV==='production',
    paymentMode:process.env.PAYMENT_MODE || (process.env.NODE_ENV==='production'?'payhere-sandbox':'demo'),
    secure:process.env.NODE_ENV==='production', merchantId:process.env.PAYHERE_MERCHANT_ID,
    merchantSecret:process.env.PAYHERE_MERCHANT_SECRET, notifyUrl:process.env.PAYHERE_NOTIFY_URL, ...options };
  if(!['demo','payhere-sandbox'].includes(config.paymentMode))throw new Error('PAYMENT_MODE must be demo or payhere-sandbox. Live payments are not supported.');
  if(config.production&&config.paymentMode==='demo')throw new Error('Local demo payments cannot run with NODE_ENV=production. Use payhere-sandbox after deployment.');
  const store=createStore(config.database);
  if(!store.user('admin@insuranceproplus.com')) store.saveUser({id:'ADM-001',name:'Insurance Pro Plus Admin',email:'admin@insuranceproplus.com',
    passwordHash:await hashPassword(process.env.ADMIN_PASSWORD || 'Admin@123'),kind:'admin',role:'System Administrator',department:'Administration',status:'Active',createdAt:now(),phone:'',country:'Sri Lanka'});
  const dummyHash=await hashPassword(token());
  const attempts=new Map();
  function limit(key,max=10) {
    const time=Date.now();
    if(attempts.size>10000) for(const [k,v] of attempts) if(v.until<time) attempts.delete(k);
    const item=attempts.get(key); if(item && item.until>time){ if(item.count>=max) fail(429,'Too many attempts. Try again in 15 minutes.'); item.count++; }
    else attempts.set(key,{count:1,until:time+900000});
  }
  function session(req) {
    const raw=req.headers.cookie?.split(';').map(x=>x.trim()).find(x=>x.startsWith('ipp_session='))?.slice(12);
    if(!raw || !/^[a-f0-9]{64}$/.test(raw)) return null;
    const row=store.db.prepare('SELECT user_id FROM sessions WHERE hash=? AND expires>?').get(digest(raw),Date.now());
    const user=row && store.user(row.user_id); return user?.status==='Active' ? user : null;
  }
  const cookie=(res,value,remember=false)=>res.setHeader('Set-Cookie',`ipp_session=${value}; Path=/; HttpOnly; SameSite=Lax${config.secure?'; Secure':''}${!value?'; Max-Age=0':remember?'; Max-Age=2592000':''}`);
  function issueSession(req,res,user,remember) {
    const previous=req.headers.cookie?.match(/(?:^|;\s*)ipp_session=([a-f0-9]{64})/)?.[1];
    if(previous) store.db.prepare('DELETE FROM sessions WHERE hash=?').run(digest(previous));
    store.db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());
    const raw=token(); store.db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(digest(raw),user.id,Date.now()+(remember?2592000000:43200000)); cookie(res,raw,remember);
  }
  function requireUser(user,admin=false) { if(!user) fail(401,'Please sign in to continue.'); if(admin && user.kind!=='admin') fail(403,'Administrator access required.'); return user; }
  function requireManager(user) { requireUser(user,true); if(user.role!=='System Administrator') fail(403,'System administrator access required.'); }
  function owned(kind,key,user) { requireUser(user); const item=store.get(kind,key); if(!item || (user.kind!=='admin' && item.owner!==user.id)) fail(404,'Record not found.'); return item; }
  function notifyAdmins(title,message,category,link) { store.users().filter(u=>u.kind==='admin' && u.status==='Active').forEach(u=>store.notify(u.id,title,message,category,link)); }
  function view(kind,item,admin=false) {
    if(kind==='policies') return {...item,status:item.status==='Active'&&(Date.parse(item.paidThrough)<Date.now()||Date.parse(item.expiryDate)<Date.now())?'Expired':item.status,number:item.id,holder:store.user(item.owner)?.businessName || store.user(item.owner)?.name || '',coverageAmount:item.coverage,premiumAmount:item.premium,renewalDate:item.expiryDate,items:item.benefits,coverage:admin?item.coverage:money(item.coverage),premium:admin?item.premium:money(item.premium)+(item.billingCycle==='annual'?'/year':'/month')};
    if(kind==='claims') { const {notes,...publicClaim}=item; return {...(admin?item:publicClaim),customer:store.user(item.owner)?.name || '',policy:item.policyId,email:store.user(item.owner)?.email,phone:store.user(item.owner)?.phone,coverage:store.get('policies',item.policyId)?.coverage,policyStatus:store.get('policies',item.policyId)?.status,amountValue:item.amount,amount:admin?item.amount:money(item.amount)}; }
    if(kind==='payments') return {...item,customer:store.user(item.owner)?.name || '',policy:admin?item.policyId:item.policyName,amountValue:item.amount,amount:admin?item.amount:money(item.amount),status:!admin && item.status==='Paid'?'Completed':item.status};
    if(kind==='documents') { const {base64,...clean}=item; return {...clean,customer:store.user(item.owner)?.name || '',size:(item.byteLength/1024).toFixed(1)+' KB'}; }
    return item;
  }
  function customers() { return store.users().filter(u=>u.kind==='customer').map(u=>({...publicUser(u),type:u.accountType,joined:u.createdAt,policies:store.list('policies',u.id).length,openClaims:store.list('claims',u.id).filter(c=>!['Approved','Rejected','Paid'].includes(c.status)).length,documents:store.list('documents',u.id).length,totalPremium:store.list('payments',u.id).filter(p=>p.status==='Paid').reduce((s,p)=>s+p.amount,0)})); }
  function staff() { return store.users().filter(u=>u.kind==='admin').map(u=>({...publicUser(u),joinedDate:u.createdAt,lastActive:u.lastLogin || 'Never',assignedClaims:store.list('claims').filter(c=>c.officerId===u.id).length,pendingReviews:store.list('claims').filter(c=>c.officerId===u.id&&!['Approved','Rejected','Paid'].includes(c.status)).length,completedThisMonth:store.list('claims').filter(c=>c.officerId===u.id&&['Approved','Rejected','Paid'].includes(c.status)&&c.updatedAt?.startsWith(now().slice(0,7))).length})); }
  function records(kind,user,admin=false) {
    if(kind==='customers'){requireUser(user,true);return customers();}
    if(kind==='staff'){requireUser(user,true);return staff();}
    if(kind==='audit') requireUser(user,true);
    return store.list(kind,kind==='notifications'?user.id:admin?undefined:user.id).map(r=>view(kind,r,admin));
  }
  function analytics(query) {
    let policies=store.list('policies'),claims=store.list('claims'),payments=store.list('payments');
    const requestedDays=Number(query.get('days')||365);const days=Number.isFinite(requestedDays)?requestedDays:365; const since=Date.now()-Math.min(Math.max(days,1),36500)*86400000;
    const type=query.get('type');
    if(type && type!=='All Insurance Types') { policies=policies.filter(p=>p.type===type || p.productId===type);const keys=new Set(policies.map(p=>p.id));claims=claims.filter(c=>keys.has(c.policyId));payments=payments.filter(p=>keys.has(p.policyId)); }
    payments=payments.filter(p=>Date.parse(p.date)>=since);claims=claims.filter(c=>Date.parse(c.submittedDate)>=since);
    const paid=payments.filter(p=>p.status==='Paid');const people=customers();
    const monthly=Array.from({length:12},(_,i)=>{const d=new Date();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-11+i);return {name:d.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}),key:d.toISOString().slice(0,7)};});
    return { customers:people.length,activePolicies:policies.filter(p=>p.status==='Active'&&Date.parse(p.paidThrough)>Date.now()&&Date.parse(p.expiryDate)>Date.now()).length,openClaims:claims.filter(c=>!['Approved','Rejected','Paid'].includes(c.status)).length,
      premium:paid.reduce((s,p)=>s+p.amount,0),claimsPaid:claims.filter(c=>c.status==='Paid').reduce((s,c)=>s+c.amount,0),claimsCount:claims.length,
      expiring:policies.filter(p=>Date.parse(p.expiryDate)>Date.now() && Date.parse(p.expiryDate)<Date.now()+30*86400000).length,
      approvalRate:claims.length?Math.round(claims.filter(c=>['Approved','Paid'].includes(c.status)).length/claims.length*100):0,
      newCustomers:people.filter(u=>Date.parse(u.createdAt)>=since).length,
      revenueData:monthly.map(m=>({name:m.name,revenue:paid.filter(p=>p.date.startsWith(m.key)).reduce((s,p)=>s+p.amount,0)})),
      claimsData:monthly.map(m=>({name:m.name,submitted:claims.filter(c=>c.submittedDate.startsWith(m.key)).length,approved:claims.filter(c=>c.submittedDate.startsWith(m.key)&&['Approved','Paid'].includes(c.status)).length,rejected:claims.filter(c=>c.submittedDate.startsWith(m.key)&&c.status==='Rejected').length})),
      customerGrowth:monthly.map(m=>({name:m.name,newCustomers:people.filter(u=>u.createdAt.startsWith(m.key)).length})),
      policyDistribution:products.map((p,i)=>({name:p.name,value:policies.filter(x=>x.productId===p.id).length,color:['#2563eb','#10b981','#f59e0b','#8b5cf6'][i%4]})).filter(p=>p.value),
      paymentStatus:['Paid','Pending','Failed','Cancelled','Refunded'].map((name,i)=>({name,value:payments.filter(p=>p.status===name).length,color:['#10b981','#f59e0b','#ef4444','#64748b','#8b5cf6'][i]})),
      claimsByType:products.map(p=>({name:p.name,amount:claims.filter(c=>store.get('policies',c.policyId)?.productId===p.id).length})),
      recentClaims:claims.slice(0,5).map(c=>({...view('claims',c,true),amount:money(c.amount),date:c.submittedDate})),
    };
  }
  async function body(req,form=false) {
    let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>8*1024*1024) fail(413,'Request too large (maximum 8 MB).');chunks.push(chunk);}
    const raw=Buffer.concat(chunks).toString();
    if(form) return Object.fromEntries(new URLSearchParams(raw));
    if(!req.headers['content-type']?.startsWith('application/json')) fail(415,'Use application/json.');
    try {const value=JSON.parse(raw||'{}');if(!value || typeof value!=='object' || Array.isArray(value)) fail(400,'Invalid JSON body.');return value;}catch{fail(400,'Invalid JSON body.');}
  }
  const server=createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
    const send=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(value));};
    const download=(bytes,name,type='application/pdf')=>{res.writeHead(200,{'Content-Type':type,'Content-Disposition':`attachment; filename="${name.replace(/[^a-zA-Z0-9._-]/g,'_')}"`});res.end(bytes);};
    try {
      const url=new URL(req.url,'http://localhost');const path=url.pathname;const method=req.method;const mutating=!['GET','HEAD','OPTIONS'].includes(method);
      if(mutating && path!=='/api/payhere/notify') {
        const origin=req.headers.origin;
        if(origin && origin!==config.origin && origin!==`http://${req.headers.host}`) fail(403,'Request origin is not allowed.');
        if(req.headers['sec-fetch-site']==='cross-site') fail(403,'Cross-site requests are not allowed.');
      }
      if(!path.startsWith('/api/')&&await serveFrontend(req,res,config.frontendDist))return;
      const user=session(req);
      if(user?.mustChangePassword&&!['/api/auth/me','/api/auth/password','/api/auth/logout','/api/auth/profile'].includes(path))fail(403,'Change your temporary password before continuing.');
      if(path==='/api/health' && method==='GET') return send({ok:true});
      if(path==='/api/products' && method==='GET') return send(products.map(({rate,...p})=>p));
      if(path==='/api/public/settings' && method==='GET'){const s=store.settings();return send({companyName:s.companyName,email:s.email,phone:s.phone,address:s.address});}
      if(path==='/api/auth/me' && method==='GET') return send(user?publicUser(user):null);
      if(path==='/api/auth/register' && method==='POST') {
        limit('register:'+req.socket.remoteAddress,20);const b=await body(req);const address=email(b.email);const pw=password(b.password);
        const accountType=text(b.accountType,'Account type');if(!['Individual','Business'].includes(accountType)) fail(400,'Choose Individual or Business.');
        if(b.terms!==true) fail(400,'Accept the terms to register.');if(store.user(address)) fail(409,'An account already exists for this email.');
        const account={id:id('CUS'),name:text(b.fullName||b.name,'Full name',2,120),email:address,passwordHash:await hashPassword(pw),kind:'customer',role:'Customer',accountType,
          businessName:accountType==='Business'?text(b.businessName,'Business name',2,160):'',country:text(b.country,'Country',2,100),phone:'',address:'',city:'',status:'Active',createdAt:now(),preferences:{}};
        try{store.transaction(()=>{store.saveUser(account);store.audit(account,'Registered','Customer',account.id);notifyAdmins('New customer',account.name,'Customers','/admin/customers/'+account.id);});}catch(e){if(e.message.includes('UNIQUE')) fail(409,'An account already exists for this email.');throw e;}
        return send({message:'Account created. Please sign in.'},201);
      }
      if(path==='/api/auth/login' && method==='POST') {
        const b=await body(req);const address=email(b.email);limit('login:'+req.socket.remoteAddress+':'+address);
        const account=store.user(address);const valid=await verifyPassword(b.password,account?.passwordHash||dummyHash);
        if(!account || !valid || account.status!=='Active' || (b.adminOnly && account.kind!=='admin')) fail(401,'Invalid email or password.');
        account.lastLogin=now();store.saveUser(account);issueSession(req,res,account,b.remember===true);store.audit(account,'Signed in','Account',account.id);return send(publicUser(account));
      }
      if(path==='/api/auth/logout' && method==='POST') {const raw=req.headers.cookie?.match(/(?:^|;\s*)ipp_session=([a-f0-9]{64})/)?.[1];if(raw)store.db.prepare('DELETE FROM sessions WHERE hash=?').run(digest(raw));cookie(res,'');return send({ok:true});}
      if(path==='/api/auth/avatar'&&method==='POST'){
        requireUser(user);const b=await body(req);if(typeof b.base64!=='string')fail(400,'Choose a JPG or PNG image.');const bytes=Buffer.from(b.base64,'base64');if(!bytes.length||bytes.length>2*1024*1024)fail(400,'Maximum image size is 2 MB.');
        const mime=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':null;if(!mime)fail(400,'Choose a JPG or PNG image.');
        const key='AVA-'+user.id;store.transaction(()=>{store.save('avatars',{id:key,owner:user.id,mime});store.db.prepare('INSERT INTO files VALUES (?,?) ON CONFLICT(id) DO UPDATE SET bytes=excluded.bytes').run(key,bytes);store.saveUser({...user,avatarUrl:'/api/avatars/'+key+'?v='+Date.now()});});return send(publicUser(store.user(user.id)));
      }
      const avatar=path.match(/^\/api\/avatars\/([^/]+)$/);if(avatar&&method==='GET'){const record=owned('avatars',avatar[1],user);res.writeHead(200,{'Content-Type':record.mime});return res.end(store.db.prepare('SELECT bytes FROM files WHERE id=?').get(record.id).bytes);}
      if(path==='/api/auth/profile' && method==='PATCH') {
        requireUser(user);const b=await body(req);const updated={...user};
        for(const key of ['name','phone','country','city','address','businessName']) if(b[key]!==undefined) updated[key]=text(b[key],key,key==='name'?2:0,key==='address'?300:160);
        if(b.preferences && typeof b.preferences==='object') updated.preferences=Object.fromEntries(['Policy Renewals','Claim Updates','Payment Receipts','Marketing & Offers'].map(k=>[k,b.preferences[k]===true]));
        store.saveUser(updated);store.audit(user,'Updated profile','Account',user.id);return send(publicUser(updated));
      }
      if(path==='/api/auth/password' && method==='POST') {requireUser(user);limit('password:'+user.id);const b=await body(req);if(!await verifyPassword(b.currentPassword,user.passwordHash))fail(400,'Current password is incorrect.');const hash=await hashPassword(password(b.newPassword));store.saveUser({...user,passwordHash:hash,passwordChangedAt:now(),mustChangePassword:false});store.db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);issueSession(req,res,user,false);store.audit(user,'Changed password','Account',user.id);return send({ok:true});}
      if(path==='/api/quotes' && method==='POST') {
        requireUser(user);if(user.kind!=='customer')fail(403,'Use a customer account to request a quote.');const b=await body(req);const product=products.find(p=>p.id===b.productId);if(!product)fail(400,'Choose an insurance type.');
        const accountType=text(b.accountType,'Account type');if(accountType!==product.type || accountType!==user.accountType)fail(400,'Choose insurance matching your account type.');
        const billingCycle=b.billingCycle||'monthly';if(!['monthly','annual'].includes(billingCycle))fail(400,'Invalid billing cycle.');const bundle=b.offer==='bundle20';if(bundle&&(!['bp','bv'].includes(product.id)||!store.list('policies',user.id).some(p=>p.productId===(product.id==='bp'?'bv':'bp')&&p.status==='Active'&&Date.parse(p.paidThrough)>Date.now())))fail(409,'The bundle offer requires an active, paid property or vehicle policy and a quote for the other product.');
        const coverage=amount(b.coverage,1000,10000000);const details=text(b.details,'Personal/business details',5,3000);const settings=store.settings();
        const quote={id:id('QUO'),owner:user.id,productId:product.id,accountType,details,coverage,billingCycle,offer:bundle?'bundle20':null,createdAt:now(),expiresAt:new Date(Date.now()+7*86400000).toISOString(),plans:[0.75,1,1.5].map((factor,i)=>({id:['basic','plus','premium'][i],name:`${accountType==='Business'?'Business':product.name.split(' ')[0]} ${['Basic','Plus','Premium'][i]} Plan`,coverage:Math.round(coverage*factor),premium:Math.round(Math.max(settings.minPremium,coverage*factor*settings.rates[product.id])*(billingCycle==='annual'?10:1)*(bundle?0.8:1)*100)/100,billingCycle,currency:'USD',benefits:product.benefits}))};
        store.save('quotes',quote);return send(quote,201);
      }
      const select=path.match(/^\/api\/quotes\/([^/]+)\/select$/);
      if(select && method==='POST') {
        requireUser(user);if(user.kind!=='customer')fail(403,'Customer account required.');const b=await body(req);const quote=owned('quotes',select[1],user);
        if(quote.policyId)return send(view('policies',store.get('policies',quote.policyId)));if(Date.parse(quote.expiresAt)<Date.now())fail(409,'This quote expired. Request a new quote.');const plan=quote.plans.find(p=>p.id===b.planId);if(!plan)fail(400,'Choose a plan from this quote.');
        const product=products.find(p=>p.id===quote.productId);const policy={id:id('POL'),owner:user.id,productId:product.id,name:product.name,planName:plan.name,type:product.type,coverage:plan.coverage,premium:plan.premium,billingCycle:quote.billingCycle||'monthly',offer:quote.offer,currency:'USD',benefits:plan.benefits,status:'Pending Payment',paymentStatus:'Pending',createdAt:now(),startDate:null,expiryDate:null};
        store.transaction(()=>{store.save('policies',policy);store.save('quotes',{...quote,policyId:policy.id});store.audit(user,'Selected plan','Policy',policy.id);notifyAdmins('New policy application',policy.id,'Policies','/admin/policies/'+policy.id);});return send(view('policies',policy),201);
      }
      if(path==='/api/payments/config'&&method==='GET'){requireUser(user);return send({mode:config.paymentMode,simulated:config.paymentMode==='demo'});}
      if(path==='/api/payments/checkout' && method==='POST') {
        requireUser(user);if(user.kind!=='customer')fail(403,'Customer account required.');const b=await body(req);const policy=owned('policies',b.policyId,user);if(['Cancelled','Suspended'].includes(policy.status))fail(409,'This policy cannot accept payments.');
        if(policy.status==='Active' && Date.parse(policy.paidThrough)>Date.now()+7*86400000) fail(409,'This policy is already paid for the current period.');
        const pending=store.list('payments',user.id).find(p=>p.policyId===policy.id&&p.status==='Pending'&&(p.provider||'payhere-sandbox')===config.paymentMode);
        const payment=pending || {id:id('PAY'),owner:user.id,policyId:policy.id,policyName:policy.name,amount:policy.premium,currency:'USD',provider:config.paymentMode,simulated:config.paymentMode==='demo',method:config.paymentMode==='demo'?'PayHere Demo (Simulated)':'PayHere Sandbox',status:'Pending',date:now()};
        const checkout=prepareCheckout(payment,{...user,phone:b.phone||user.phone,address:b.address||user.address,city:b.city||user.city,country:b.country||user.country},config);
        store.save('payments',payment);return send(checkout,201);
      }
      const demoComplete=path.match(/^\/api\/payments\/([^/]+)\/demo-complete$/);
      if(demoComplete&&method==='POST'){
        if(config.paymentMode!=='demo')fail(404,'Payments are disabled in this mode.');
        requireUser(user);if(user.kind!=='customer')fail(403,'Customer account required.');
        await body(req);const payment=owned('payments',demoComplete[1],user);
        if(payment.provider!=='demo'||payment.simulated!==true)fail(409,'Only a local checkout can be simulated.');
        if(payment.status==='Paid')return send({payment:view('payments',payment),policy:view('policies',owned('policies',payment.policyId,user))});
        if(payment.status!=='Pending')fail(409,'This checkout is no longer pending.');
        const policy=owned('policies',payment.policyId,user);
        if(['Cancelled','Suspended'].includes(policy.status))fail(409,'This policy cannot accept payments.');
        if(policy.premium!==payment.amount||policy.currency!==payment.currency)fail(409,'The policy premium changed. Start a new checkout.');
        if(policy.status==='Active'&&Date.parse(policy.paidThrough)>Date.now()+7*86400000)fail(409,'This policy is already paid for the current period.');
        const completed=store.transaction(()=>settlePayment(store,payment.id,{status:'Paid',gatewayId:'DEMO-'+payment.id},notifyAdmins));
        return send({payment:view('payments',completed),policy:view('policies',store.get('policies',policy.id))});
      }
      if(path==='/api/payhere/notify' && method==='POST') {
        if(config.paymentMode!=='payhere-sandbox')fail(404,'PayHere callbacks are disabled in local simulation mode.');
        const b=await body(req,true);const payment=store.get('payments',b.order_id);if(!payment || payment.simulated || (payment.provider&&payment.provider!=='payhere-sandbox') || !verifyNotification(b,payment,config))fail(400,'Invalid payment notification.');
        if(!['2','0','-1','-2','-3'].includes(b.status_code))fail(400,'Unknown payment status.');
        const eventKey=digest([b.payment_id,b.order_id,b.status_code].join(':'));
        store.transaction(()=>{if(store.db.prepare('SELECT id FROM webhook_events WHERE id=?').get(eventKey))return;
          store.db.prepare('INSERT INTO webhook_events VALUES (?,?)').run(eventKey,now());
          const status={'2':'Paid','0':'Pending','-1':'Cancelled','-2':'Failed','-3':'Refunded'}[b.status_code];
          settlePayment(store,payment.id,{status,gatewayId:b.payment_id},notifyAdmins);
        });return send({ok:true});
      }
      if(path==='/api/claims' && method==='POST') {
        requireUser(user);const b=await body(req);const policy=owned('policies',b.policyId,user);if(user.kind!=='customer'||(policy.status!=='Active'||Date.parse(policy.paidThrough)<Date.now()||Date.parse(policy.expiryDate)<Date.now()))fail(409,'Claims require an active policy.');
        const incidentDate=text(b.incidentDate,'Incident date');const time=Date.parse(incidentDate);if(!Number.isFinite(time)||time>Date.now()||time<Date.parse(policy.startDate)-86400000)fail(400,'Incident date must fall within the active policy period and not be in the future.');
        const claim={id:id('CLM'),owner:user.id,policyId:policy.id,policyName:policy.name,type:policy.type,incident:text(b.incidentType,'Incident type',2,120),date:incidentDate,submittedDate:now(),amount:amount(b.amount,1,policy.coverage),status:'Submitted',description:text(b.description,'Description',10,4000),location:text(b.location,'Location',2,300),officer:'Unassigned',officerId:null,notes:[],messages:[]};
        store.transaction(()=>{store.save('claims',claim);store.audit(user,'Submitted claim','Claim',claim.id);notifyAdmins('New claim',claim.id,'Claims','/admin/claims/'+claim.id);});return send(view('claims',claim),201);
      }
      if(path==='/api/documents' && method==='POST') {
        requireUser(user);const b=await body(req);if(user.kind==='admin')requireWrite(user,'documents');const related=text(b.related,'Related policy or claim');const parent=store.get('claims',related)||store.get('policies',related);if(!parent || (user.kind!=='admin' && parent.owner!==user.id))fail(404,'Related policy or claim not found.');
        const name=text(b.name,'Filename',1,160);if(!/\.(pdf|png|jpe?g|txt)$/i.test(name))fail(400,'Upload PDF, PNG, JPG or TXT files.');
        if(typeof b.base64!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(b.base64))fail(400,'Invalid file content.');const bytes=Buffer.from(b.base64,'base64');if(bytes.length===0||bytes.length>5*1024*1024)fail(400,'Files must be between 1 byte and 5 MB.');
        const doc={id:id('DOC'),owner:parent.owner,name,related,category:related.startsWith('CLM')?'Claim Documents':'Policy Documents',type:name.split('.').pop().toUpperCase(),byteLength:bytes.length,uploadDate:now(),uploadedBy:user.name,status:'Pending Verification'};
        store.transaction(()=>{store.save('documents',doc);store.db.prepare('INSERT INTO files VALUES (?,?)').run(doc.id,bytes);store.audit(user,'Uploaded document','Document',doc.id);notifyAdmins('Document uploaded',name,'Documents','/admin/documents');});return send(view('documents',doc),201);
      }
      const file=path.match(/^\/api\/documents\/([^/]+)\/download$/);if(file&&method==='GET'){const doc=owned('documents',file[1],user);return download(store.db.prepare('SELECT bytes FROM files WHERE id=?').get(doc.id).bytes,doc.name,'application/octet-stream');}
      const print=path.match(/^\/api\/(policies|payments|claims)\/([^/]+)\/download$/);
      if(print&&method==='GET'){const item=owned(print[1],print[2],user);if(print[1]==='payments'&&item.status!=='Paid')fail(409,'A receipt is available after payment confirmation.');return download(pdf(['Insurance Pro Plus',print[1]==='payments'?(item.simulated?'DEMO RECEIPT - SIMULATED, NO MONEY CHARGED':'PAYMENT RECEIPT (SANDBOX)'):'INSURANCE RECORD',...Object.entries(item).filter(([k,v])=>!['owner','notes','messages','details'].includes(k)&&['string','number'].includes(typeof v)).map(([k,v])=>k+': '+v)]),item.id+'.pdf');}
      if(path==='/api/tickets'&&method==='POST'){limit('ticket:'+req.socket.remoteAddress,30);const b=await body(req);const ticket={id:id('SUP'),owner:user?.id||null,name:user?.name||text(b.name,'Name',2,120),email:user?.email||email(b.email),subject:text(b.subject,'Subject',3,200),message:text(b.message,'Message',5,5000),status:'Open',createdAt:now(),replies:[]};store.save('tickets',ticket);notifyAdmins('Support request',ticket.subject,'Support','/admin/help');return send({id:ticket.id,message:'Your support request has been saved.'},201);}
      const message=path.match(/^\/api\/(claims|tickets)\/([^/]+)\/messages$/);if(message&&method==='POST'){const item=owned(message[1],message[2],user);if(user.kind==='admin')requireWrite(user,message[1]);const b=await body(req);const key=message[1]==='tickets'?'replies':'messages';const updated={...item,[key]:[...(item[key]||[]),safeNote(user,b.message)]};store.save(message[1],updated);if(item.owner)store.notify(item.owner,'New message',item.id,'Support',message[1]==='claims'?'/claims/'+item.id:'/support');if(user.kind==='customer')notifyAdmins('Customer message',item.id,'Support',message[1]==='claims'?'/admin/claims/'+item.id:'/admin/help');return send(view(message[1],updated,user.kind==='admin'));}
      const notification=path.match(/^\/api\/notifications\/(all|[^/]+)$/);if(notification&&method==='PATCH'){requireUser(user);const b=await body(req);const list=notification[1]==='all'?store.list('notifications',user.id):[owned('notifications',notification[1],user)];for(const n of list){if(n.owner!==user.id)fail(403,'Not your notification.');store.save('notifications',{...n,read:b.read!==false});}return send({ok:true});}
      if(path==='/api/admin/payment-config'&&method==='GET'){requireUser(user,true);return send({provider:'PayHere',mode:config.paymentMode,simulated:config.paymentMode==='demo',configured:config.paymentMode==='demo'||!!(config.merchantId&&config.merchantSecret&&config.notifyUrl)});}
      if(path==='/api/admin/settings'){requireManager(user);if(method==='GET')return send(store.settings());if(method==='PATCH'){const b=await body(req);const settings={...store.settings()};for(const k of ['companyName','registrationNumber','email','phone','address'])if(b[k]!==undefined)settings[k]=text(b[k],k,0,300);if(b.rates){for(const p of products)if(b.rates[p.id]!==undefined){const rate=Number(b.rates[p.id]);if(!Number.isFinite(rate)||rate<0.00001||rate>0.1)fail(400,'Rates must be between 0.00001 and 0.1.');settings.rates[p.id]=rate;};}if(b.minPremium!==undefined)settings.minPremium=amount(b.minPremium,1,100000);store.saveSettings(settings);store.audit(user,'Updated settings','Settings','1');return send(settings);}}
      if(path==='/api/admin/analytics'&&method==='GET'){requireUser(user,true);return send(analytics(url.searchParams));}
      if(path==='/api/admin/export'&&method==='GET'){requireUser(user,true);const kind=url.searchParams.get('kind')||'payments';if(!['policies','claims','payments','customers','staff','audit','documents','tickets'].includes(kind))fail(400,'Invalid export type.');let list=records(kind,user,true);const days=Number(url.searchParams.get('days'));if(Number.isFinite(days)&&days>0)list=list.filter(r=>Date.parse(r.date||r.submittedDate||r.createdAt||r.time)>=Date.now()-days*86400000);const type=url.searchParams.get('type');if(type&&type!=='All Insurance Types')list=list.filter(r=>{const policy=kind==='policies'?r:store.get('policies',r.policyId);return policy?.type===type||policy?.productId===type;});const columns=Object.keys(list[0]||{id:''}).filter(k=>!['owner','notes','messages','replies'].includes(k));const cells=v=>'"'+String(v??'').replace(/^[\s]*[=+@-]/,"'$&").replaceAll('"','""')+'"';if(url.searchParams.get('format')==='pdf')return download(pdf(['Insurance Pro Plus - '+kind,...list.map(r=>columns.map(k=>`${k}: ${typeof r[k]==='object'?JSON.stringify(r[k]):r[k]??''}`).join(' | '))]),kind+'.pdf');return download([columns.map(cells).join(','),...list.map(r=>columns.map(k=>cells(typeof r[k]==='object'?JSON.stringify(r[k]):r[k])).join(','))].join('\r\n'),kind+'.csv','text/csv');}
      if(path==='/api/admin/search'&&method==='GET'){requireUser(user,true);const q=(url.searchParams.get('q')||'').toLowerCase().slice(0,100);if(!q)return send([]);const result=[];for(const kind of ['customers','policies','claims'])for(const r of records(kind,user,true))if(JSON.stringify(r).toLowerCase().includes(q))result.push({id:r.id,name:r.name||r.policyName||r.id,kind,link:`/admin/${kind}/${r.id}`});return send(result.slice(0,15));}
      if(path==='/api/admin/staff'&&method==='POST'){requireManager(user);const b=await body(req);const address=email(b.email);if(store.user(address))fail(409,'Email already registered.');if(!roles.includes(b.role))fail(400,'Invalid staff role.');const account={id:id('STF'),kind:'admin',employeeNumber:typeof b.empId==='string'?text(b.empId,'Employee ID',0,40):'',mustChangePassword:b.mustChangePassword===true,name:text(b.name,'Name',2,120),email:address,passwordHash:await hashPassword(password(b.password)),role:b.role,department:text(b.department,'Department'),status:'Active',createdAt:now(),phone:typeof b.phone==='string'?b.phone:'',country:'Sri Lanka'};store.saveUser(account);store.audit(user,'Created staff','Staff',account.id);return send(publicUser(account),201);}
      const editAccount=path.match(/^\/api\/admin\/(customers|staff)\/([^/]+)$/);
      if(editAccount&&method==='PATCH'){requireManager(user);const target=store.user(editAccount[2]);if(!target||(editAccount[1]==='customers')!==(target.kind==='customer'))fail(404,'Account not found.');const b=await body(req);const updated={...target};for(const k of ['name','phone','address','city','businessName','department'])if(b[k]!==undefined)updated[k]=text(b[k],k,k==='name'?2:0,300);if(b.status!==undefined){if(!['Active','Suspended'].includes(b.status))fail(400,'Invalid status.');if(target.id==='ADM-001'||target.id===user.id)fail(409,'You cannot suspend the default administrator or your own account.');updated.status=b.status;}if(b.role!==undefined){if(!roles.includes(b.role)||target.id==='ADM-001')fail(400,'Role cannot be assigned.');updated.role=b.role;}store.saveUser(updated);if(updated.status!=='Active')store.db.prepare('DELETE FROM sessions WHERE user_id=?').run(target.id);store.audit(user,'Updated account',editAccount[1],target.id);return send(publicUser(updated));}
      const reset=path.match(/^\/api\/admin\/(staff|customers)\/([^/]+)\/password$/);if(reset&&method==='POST'){requireManager(user);const target=store.user(reset[2]);if(!target||target.kind!==(reset[1]==='staff'?'admin':'customer'))fail(404,'Account not found.');const b=await body(req);store.saveUser({...target,passwordHash:await hashPassword(password(b.password)),mustChangePassword:true,passwordChangedAt:now()});store.db.prepare('DELETE FROM sessions WHERE user_id=?').run(target.id);store.audit(user,'Reset password','Account',target.id);return send({ok:true});}
      const renewal=path.match(/^\/api\/admin\/policies\/([^/]+)\/renewal$/);
      if(renewal&&method==='POST'){requireUser(user,true);requireWrite(user,'policies');const policy=owned('policies',renewal[1],user);if(['Cancelled','Suspended'].includes(policy.status))fail(409,'This policy cannot be renewed.');store.notify(policy.owner,'Premium reminder',policy.id+' has a premium of '+money(policy.premium)+'.','Policies','/payments?policy='+policy.id);store.audit(user,'Sent premium reminder','Policy',policy.id);return send({ok:true});}
      const patch=path.match(/^\/api\/admin\/(policies|claims|documents|tickets)\/([^/]+)$/);
      if(patch&&method==='PATCH'){
        requireUser(user,true);const [_,kind,key]=patch;requireWrite(user,kind);const item=owned(kind,key,user);const b=await body(req);const updated={...item,updatedAt:now()};
        const allowed={policies:['Suspended','Cancelled','Active'],claims:['Under Review','Additional Information Required','Approved','Rejected'],documents:['Verified','Rejected'],tickets:['Open','Closed']};
        if(b.status!==undefined){if(!allowed[kind].includes(b.status))fail(400,'Invalid status transition.');if(kind==='policies' && b.status==='Active' && item.paymentStatus!=='Paid')fail(409,'A verified payment is required to activate coverage.');if(kind==='claims'&&['Approved','Rejected','Paid'].includes(item.status))fail(409,'This claim has already been decided.');updated.status=b.status;}
        if(kind==='policies' && b.planName!==undefined)updated.planName=text(b.planName,'Plan name',2,160);
        if(kind==='claims'){
          if(b.officerId!==undefined){const officer=store.user(b.officerId);if(!officer||officer.kind!=='admin'||officer.status!=='Active')fail(400,'Choose an active staff member.');updated.officerId=officer.id;updated.officer=officer.name;}
          if(b.note)updated.notes=[safeNote(user,b.note),...(item.notes||[])];
          if(b.message)updated.messages=[...(item.messages||[]),safeNote(user,b.message)];
        }
        if(kind==='documents'&&b.reason)updated.reason=text(b.reason,'Reason',1,2000);
        store.transaction(()=>{store.save(kind,updated);store.audit(user,'Updated '+kind,kind,item.id);if(item.owner)store.notify(item.owner,'Update to '+kind,item.id+': '+(updated.status||''),kind[0].toUpperCase()+kind.slice(1),kind==='claims'?'/claims/'+item.id:kind==='policies'?'/policies/'+item.id:'/support');});return send(view(kind,updated,true));
      }
      const cancel=path.match(/^\/api\/policies\/([^/]+)\/cancel$/);if(cancel&&method==='POST'){const item=owned('policies',cancel[1],user);if(user.kind==='admin')requireWrite(user,'policies');store.save('policies',{...item,status:'Cancelled'});store.audit(user,'Cancelled policy','Policy',item.id);notifyAdmins('Policy cancelled',item.id,'Policies','/admin/policies/'+item.id);return send({ok:true});}
      const list=path.match(/^\/api\/(admin\/)?(policies|claims|payments|documents|quotes|notifications|tickets|customers|staff|audit)(?:\/([^/]+))?$/);
      if(list&&method==='GET'){const admin=!!list[1];requireUser(user,admin);const kind=list[2];if(['customers','staff','audit'].includes(kind)&&!admin)fail(403,'Administrator access required.');const values=records(kind,user,admin);if(list[3]){const found=values.find(v=>v.id===list[3]);if(!found)fail(404,'Record not found.');return send(found);}return send(values);}
      fail(404,'Endpoint not found.');
    } catch(error) {if(!res.headersSent)send({error:error.status?error.message:'An unexpected server error occurred.'},error.status||500);else res.end();if(!error.status)console.error(error);}
  });
  server.requestTimeout=30000;server.headersTimeout=15000;
  return {server,store,config,close:()=>new Promise(resolve=>server.close(()=>{store.close();resolve();}))};
}

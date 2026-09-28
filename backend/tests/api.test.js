import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../src/app.js';
import { md5 } from '../src/payhere.js';
import { addMonths } from '../src/dates.js';

async function fixture(t,options={}) {
  const app=await createApp({database:':memory:',paymentMode:'payhere-sandbox',origin:'http://localhost:5173',merchantId:'test-merchant',merchantSecret:'test-secret',notifyUrl:'https://example.test/api/payhere/notify',...options});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  t.after(()=>app.close());
  const base=`http://127.0.0.1:${app.server.address().port}`;
  function client(){let cookie='';return async(path,method='GET',body,extra={})=>{const response=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{}),...extra},...(body!==undefined?{body:JSON.stringify(body)}:{})});if(response.headers.has('set-cookie'))cookie=response.headers.get('set-cookie').split(';')[0];const bytes=Buffer.from(await response.arrayBuffer());let data;try{data=JSON.parse(bytes);}catch{data=bytes;}return {status:response.status,data,headers:response.headers};};}
  async function register(c,email='customer@example.test',accountType='Business'){assert.equal((await c('/auth/register','POST',{fullName:'Test Customer',email,password:'Customer123!',accountType,businessName:'Example Business',country:'Sri Lanka',terms:true,kind:'admin',role:'System Administrator'})).status,201);assert.equal((await c('/auth/login','POST',{email,password:'Customer123!'})).status,200);}
  const admin=client();assert.equal((await admin('/auth/login','POST',{email:'admin@insuranceproplus.com',password:'Admin@123',adminOnly:true})).status,200);
  async function notify(payment,status='2',changes={}){const b={merchant_id:'test-merchant',order_id:payment.id,payment_id:'gateway-'+payment.id,payhere_amount:payment.amount.toFixed(2),payhere_currency:'USD',status_code:status,...changes};b.md5sig=md5(b.merchant_id+b.order_id+b.payhere_amount+b.payhere_currency+b.status_code+md5('test-secret'));const r=await fetch(base+'/api/payhere/notify',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(b)});return r;}
  return {...app,base,client,admin,register,notify};
}

test('default administrator, registration, authorization, CSRF, session revocation',async t=>{
 const f=await fixture(t), c=f.client(), other=f.client();
 assert.equal(f.store.users().length,1);
 assert.equal((await c('/products')).data.length,9);
 assert.equal((await c('/policies')).status,401);
 assert.equal((await c('/auth/login','POST',{email:'admin@insuranceproplus.com',password:'wrong'})).status,401);
 await f.register(c);
 const me=(await c('/auth/me')).data;assert.equal(me.kind,'customer');assert.equal(me.passwordHash,undefined);
 assert.equal((await c('/admin/customers')).status,403);
 assert.equal((await c('/admin/staff','POST',{})).status,403);
 assert.equal((await c('/auth/profile','PATCH',{name:'Changed'}, {Origin:'https://evil.test'})).status,403);
 assert.deepEqual((await c('/policies')).data,[]);
 assert.equal((await other('/auth/register','POST',{fullName:'Duplicate',email:me.email,password:'Customer123!',accountType:'Individual',country:'Sri Lanka',terms:true})).status,409);
 await other('/auth/login','POST',{email:me.email,password:'Customer123!'});
 assert.equal((await c('/auth/password','POST',{currentPassword:'wrong',newPassword:'NewPassword123!'})).status,400);
 assert.equal((await c('/auth/password','POST',{currentPassword:'Customer123!',newPassword:'NewPassword123!'})).status,200);
 assert.equal((await other('/auth/me')).data,null);
 assert.equal((await c('/auth/me')).data.id,me.id);
 await f.admin('/admin/customers/'+me.id,'PATCH',{status:'Suspended'});
 assert.equal((await c('/auth/me')).data,null);
 assert.equal((await f.admin('/admin/staff/ADM-001','PATCH',{status:'Suspended'})).status,409);
});

test('estimated quotes, concurrent plan selection, PayHere signatures, ownership, claims and documents',async t=>{
 const f=await fixture(t), c=f.client(), other=f.client();await f.register(c);await f.register(other,'other@example.test');
 assert.equal((await f.admin('/admin/settings','PATCH',{rates:{bp:0.00123}})).status,200);
 assert.equal((await f.admin('/admin/settings')).data.rates.bp,0.00123);
 const quote=(await c('/quotes','POST',{productId:'bp',accountType:'Business',details:'Business office protection',coverage:250000})).data;
 assert.equal(quote.plans[1].premium,307.5);
 assert.equal((await other('/quotes/'+quote.id+'/select','POST',{planId:'plus'})).status,404);
 const selections=await Promise.all([c('/quotes/'+quote.id+'/select','POST',{planId:'plus',premium:1}),c('/quotes/'+quote.id+'/select','POST',{planId:'premium'})]);
 const policy=selections[0].data;assert.equal(selections[1].data.id,policy.id);assert.equal(policy.premiumAmount,307.5);
 assert.equal((await c('/policies')).data.length,1);
 const billing={policyId:policy.id,phone:'0771234567',address:'123 Example Street',city:'Colombo',country:'Sri Lanka',amount:1};
 assert.equal((await other('/payments/checkout','POST',billing)).status,404);
 const checkout=(await c('/payments/checkout','POST',billing)).data;
 assert.equal(checkout.action,'https://sandbox.payhere.lk/pay/checkout');assert.equal(checkout.fields.amount,'307.50');assert.equal(JSON.stringify(checkout).includes('test-secret'),false);
 assert.equal((await c('/payments/checkout','POST',billing)).data.paymentId,checkout.paymentId);
 const payment=f.store.get('payments',checkout.paymentId);
 assert.equal((await c('/payments/'+payment.id+'/download')).status,409);
 assert.equal((await f.notify(payment,'2',{payhere_amount:'1.00'})).status,400);
 assert.equal((await f.notify(payment,'2',{merchant_id:'wrong'})).status,400);
 assert.equal(f.store.get('policies',policy.id).status,'Pending Payment');
 assert.equal((await f.notify(payment)).status,200);
 const paidThrough=f.store.get('policies',policy.id).paidThrough;
 assert.equal((await f.notify(payment)).status,200);assert.equal(f.store.get('policies',policy.id).paidThrough,paidThrough);
 await f.notify(payment,'-2');assert.equal(f.store.get('payments',payment.id).status,'Paid');
 assert.equal((await c('/payments/checkout','POST',billing)).status,409);
 assert.equal((await c('/payments/'+payment.id+'/download')).data.subarray(0,4).toString(),'%PDF');
 assert.equal((await other('/payments/'+payment.id+'/download')).status,404);
 const claimBody={policyId:policy.id,incidentType:'Property damage',incidentDate:new Date().toISOString().slice(0,10),amount:1000,description:'Damage to office property after storm.',location:'Colombo'};
 assert.equal((await c('/claims','POST',{...claimBody,amount:999999999})).status,400);
 const claimResponse=await c('/claims','POST',claimBody);assert.equal(claimResponse.status,201,JSON.stringify(claimResponse.data));const claim=claimResponse.data;
 assert.equal((await other('/claims/'+claim.id)).status,404);
 assert.equal((await c('/admin/claims/'+claim.id,'PATCH',{status:'Approved'})).status,403);
 const doc=(await c('/documents','POST',{related:claim.id,name:'evidence.txt',base64:Buffer.from('Evidence contents').toString('base64')})).data;
 assert.equal((await other('/documents/'+doc.id+'/download')).status,404);
 assert.equal((await c('/documents/'+doc.id+'/download')).data.toString(),'Evidence contents');
 await f.admin('/admin/documents/'+doc.id,'PATCH',{status:'Verified'});
 await f.admin('/admin/claims/'+claim.id,'PATCH',{note:'Internal assessment',message:'Please provide the invoice.',status:'Additional Information Required'});
 const publicClaim=(await c('/claims/'+claim.id)).data;assert.equal(publicClaim.notes,undefined);assert.equal(publicClaim.messages.length,1);
 await c('/claims/'+claim.id+'/messages','POST',{message:'Invoice has been uploaded.'});
 await f.admin('/admin/claims/'+claim.id,'PATCH',{status:'Approved'});
 assert.equal((await f.admin('/admin/claims/'+claim.id,'PATCH',{status:'Rejected'})).status,409);
 const stats=(await f.admin('/admin/analytics')).data;assert.equal(stats.premium,307.5);assert.equal(stats.customers,2);assert.equal(stats.activePolicies,1);
 await f.notify(payment,'-3');await f.notify(payment,'2',{payment_id:'late-success'});assert.equal(f.store.get('payments',payment.id).status,'Refunded');assert.equal(f.store.get('policies',policy.id).status,'Suspended');
});

test('support requests, staff management, missing gateway configuration',async t=>{
 const f=await fixture(t,{merchantSecret:''}),guest=f.client(),c=f.client();await f.register(c);
 assert.equal((await guest('/tickets','POST',{name:'Guest',email:'guest@example.test',subject:'Public enquiry',message:'Please send policy information.'})).status,201);
 assert.equal((await guest('/tickets')).status,401);
 const ticket=(await c('/tickets','POST',{subject:'Coverage question',message:'Please confirm the coverage details.'})).data;
 await f.admin('/tickets/'+ticket.id+'/messages','POST',{message:'Our staff will review your question.'});
 assert.equal((await c('/tickets/'+ticket.id)).data.replies.length,1);
 const staff=await f.admin('/admin/staff','POST',{name:'Claims Officer',email:'officer@example.test',password:'Officer123!',department:'Claims',role:'Claims Officer'});assert.equal(staff.status,201);
 const officer=f.client();await officer('/auth/login','POST',{email:'officer@example.test',password:'Officer123!'});assert.equal((await officer('/admin/settings')).status,403);
 const quote=(await c('/quotes','POST',{productId:'bp',accountType:'Business',details:'Office coverage',coverage:250000})).data;
 const policy=(await c('/quotes/'+quote.id+'/select','POST',{planId:'plus'})).data;
 assert.equal((await c('/payments/checkout','POST',{policyId:policy.id})).status,503);
 assert.equal((await c('/payments')).data.length,0);
});

test('SQLite persists records and does not reset changed admin credentials',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'ipp-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const database=join(dir,'test.sqlite');const app=await createApp({database});
 const admin=app.store.user('ADM-001');app.store.saveUser({...admin,name:'Renamed administrator'});app.store.close();
 const restarted=await createApp({database});assert.equal(restarted.store.users().length,1);assert.equal(restarted.store.user('ADM-001').name,'Renamed administrator');restarted.store.close();
});

test('annual pricing, expired quotes, staff permissions, forced password change and profile images',async t=>{
 const f=await fixture(t),c=f.client(),other=f.client();await f.register(c);await f.register(other,'second@example.test');
 const request={productId:'bp',accountType:'Business',details:'Annual office cover',coverage:250000,billingCycle:'annual'};
 const quote=(await c('/quotes','POST',request)).data;assert.equal(quote.plans[1].premium,2500);
 assert.equal((await c('/quotes','POST',{...request,offer:'bundle20'})).status,409);
 f.store.save('quotes',{...quote,expiresAt:'2000-01-01T00:00:00Z'});
 assert.equal((await c('/quotes/'+quote.id+'/select','POST',{planId:'plus'})).status,409);
 const fresh=(await c('/quotes','POST',request)).data;
 const policy=(await c('/quotes/'+fresh.id+'/select','POST',{planId:'plus'})).data;
 const checkout=(await c('/payments/checkout','POST',{policyId:policy.id,phone:'0771234567',address:'123 Example Street',city:'Colombo',country:'Sri Lanka'})).data;
 await f.notify(f.store.get('payments',checkout.paymentId));
 assert.ok(Date.parse(f.store.get('policies',policy.id).paidThrough)>Date.now()+360*86400000);
 const bundle=(await c('/quotes','POST',{...request,productId:'bv',billingCycle:'monthly',offer:'bundle20'})).data;assert.equal(bundle.plans[1].premium,400);
 const staff=(await f.admin('/admin/staff','POST',{name:'Support Staff',email:'support@example.test',password:'Temporary123!',department:'Customer Service',role:'Support Officer',mustChangePassword:true})).data;
 const worker=f.client();await worker('/auth/login','POST',{email:staff.email,password:'Temporary123!'});
 assert.equal((await worker('/admin/tickets')).status,403);
 await worker('/auth/password','POST',{currentPassword:'Temporary123!',newPassword:'Changed123!'});
 assert.equal((await worker('/admin/tickets')).status,200);
 assert.equal((await worker('/admin/policies/'+policy.id,'PATCH',{status:'Cancelled'})).status,403);
 assert.equal((await worker('/admin/settings','PATCH',{rates:{bp:0.1}})).status,403);
 const invalidImage=await c('/auth/avatar','POST',{base64:Buffer.from('<svg/>').toString('base64')});assert.equal(invalidImage.status,400);
 const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS6sAAAAASUVORK5CYII=';
 const image=(await c('/auth/avatar','POST',{base64:png})).data;assert.ok(image.avatarUrl);
 assert.equal((await c(image.avatarUrl.slice(4))).headers.get('content-type'),'image/png');
 assert.equal((await other(image.avatarUrl.slice(4))).status,404);
 await f.admin('/admin/customers/'+image.id+'/password','POST',{password:'Recovery123!'});
 assert.equal((await c('/auth/me')).data,null);
});

test('month-end billing is clamped and invalid/oversized payloads are rejected',async t=>{
 assert.equal(addMonths('2027-01-31T12:00:00Z',1),'2027-02-28T12:00:00.000Z');
 assert.equal(addMonths('2028-02-29T12:00:00Z',12),'2029-02-28T12:00:00.000Z');
 const f=await fixture(t),c=f.client();await f.register(c);
 assert.equal((await c('/quotes','POST',{productId:'health',accountType:'Individual',coverage:10000,details:'Wrong account type'})).status,400);
 assert.equal((await c('/quotes','POST',{productId:'bp',accountType:'Business',coverage:'invalid',details:'Office protection'})).status,400);
 const malformed=await fetch(f.base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(malformed.status,400);
 const oversized=await c('/auth/profile','PATCH',{address:'x'.repeat(8*1024*1024+1)});assert.equal(oversized.status,413);
 for(let i=0;i<10;i++)assert.equal((await c('/auth/login','POST',{email:'missing@example.test',password:'wrong'})).status,401);
 assert.equal((await c('/auth/login','POST',{email:'missing@example.test',password:'wrong'})).status,429);
});

test('built frontend routes are served without exposing source or dotfiles',async t=>{
 const directory=await mkdtemp(join(tmpdir(),'ipp-static-'));t.after(()=>rm(directory,{recursive:true,force:true}));
 await writeFile(join(directory,'index.html'),'<html><body>Insurance frontend</body></html>');
 await writeFile(join(directory,'.env'),'do-not-expose');
 const f=await fixture(t,{frontendDist:directory});
 const page=await fetch(f.base+'/policies/POL-123');assert.equal(page.status,200);assert.match(page.headers.get('content-type'),/text\/html/);assert.match(await page.text(),/Insurance frontend/);
 assert.equal((await fetch(f.base+'/.env')).status,404);
 assert.equal((await fetch(f.base+'/api/missing')).status,404);
});

test('local demo checkout completes without merchant keys and activates once',async t=>{
 const f=await fixture(t,{paymentMode:'demo',production:false,merchantId:'',merchantSecret:'',notifyUrl:''});
 const c=f.client(),other=f.client(),guest=f.client();await f.register(c,'arun.test@example.com','Individual');await f.register(other,'other.demo@example.test','Individual');
 const quote=(await c('/quotes','POST',{productId:'health',accountType:'Individual',coverage:100000,details:'Individual health cover for Arun.'})).data;
 const policy=(await c('/quotes/'+quote.id+'/select','POST',{planId:'plus'})).data;
 assert.equal(policy.status,'Pending Payment');assert.equal(policy.premiumAmount,150);
 assert.equal((await c('/payments/config')).data.mode,'demo');
 const checkout=await c('/payments/checkout','POST',{policyId:policy.id,amount:1});assert.equal(checkout.status,201);
 assert.equal(checkout.data.mode,'demo');assert.equal(checkout.data.amount,150);
 assert.equal(checkout.data.action,undefined);assert.equal(checkout.data.fields,undefined);
 assert.equal(f.store.get('policies',policy.id).status,'Pending Payment');
 assert.equal(f.store.get('payments',checkout.data.paymentId).status,'Pending');
 assert.equal((await c('/payments/checkout','POST',{policyId:policy.id})).data.paymentId,checkout.data.paymentId);
 const endpoint='/payments/'+checkout.data.paymentId+'/demo-complete';
 assert.equal((await guest(endpoint,'POST',{})).status,401);
 assert.equal((await other(endpoint,'POST',{})).status,404);
 assert.equal((await f.admin(endpoint,'POST',{})).status,403);
 assert.equal((await c(endpoint,'POST',{}, {Origin:'https://evil.test'})).status,403);
 const completions=await Promise.all([c(endpoint,'POST',{}),c(endpoint,'POST',{})]);
 for(const result of completions){assert.equal(result.status,200);assert.equal(result.data.payment.status,'Completed');assert.equal(result.data.payment.simulated,true);assert.equal(result.data.payment.amountValue,150);assert.equal(result.data.policy.status,'Active');}
 const through=f.store.get('policies',policy.id).paidThrough;
 await c(endpoint,'POST',{});assert.equal(f.store.get('policies',policy.id).paidThrough,through);
 assert.equal(f.store.list('audit').filter(a=>a.resourceId===checkout.data.paymentId&&a.action==='Demo payment Paid').length,1);
 assert.equal((await c('/payments/checkout','POST',{policyId:policy.id})).status,409);
 const receipt=await c('/payments/'+checkout.data.paymentId+'/download');assert.equal(receipt.status,200);assert.match(receipt.data.toString(),/SIMULATED, NO MONEY CHARGED/);
 assert.equal((await f.notify(f.store.get('payments',checkout.data.paymentId))).status,404);
});

test('demo completion rejects cancelled policies and sandbox orders; switching mode disables simulator',async t=>{
 const f=await fixture(t,{paymentMode:'demo',production:false}),c=f.client();await f.register(c);
 const quote=(await c('/quotes','POST',{productId:'bp',accountType:'Business',coverage:250000,details:'Business property demo.'})).data;
 const policy=(await c('/quotes/'+quote.id+'/select','POST',{planId:'plus'})).data;
 const checkout=(await c('/payments/checkout','POST',{policyId:policy.id})).data;
 const endpoint='/payments/'+checkout.paymentId+'/demo-complete';
 const payment=f.store.get('payments',checkout.paymentId);
 f.store.save('payments',{...payment,provider:'payhere-sandbox',simulated:false});
 assert.equal((await c(endpoint,'POST',{})).status,409);
 f.store.save('payments',payment);
 await c('/policies/'+policy.id+'/cancel','POST',{});
 assert.equal((await c(endpoint,'POST',{})).status,409);
 assert.equal(f.store.get('payments',payment.id).status,'Pending');assert.equal(f.store.get('policies',policy.id).status,'Cancelled');
 f.config.paymentMode='payhere-sandbox';assert.equal((await c(endpoint,'POST',{})).status,404);
 await assert.rejects(createApp({database:':memory:',paymentMode:'live'}),/Live payments are not supported/);
 await assert.rejects(createApp({database:':memory:',paymentMode:'demo',production:true}),/Local demo payments cannot run/);
});

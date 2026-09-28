import { addMonths } from './dates.js';
import { checkoutFields } from './payhere.js';
import { fail } from './security.js';

// Both providers use the same settlement logic. Demo never contacts PayHere.
export function prepareCheckout(payment, customer, config) {
  if(config.paymentMode==='demo') return {
    mode:'demo', paymentId:payment.id, policyId:payment.policyId,
    amount:payment.amount, currency:payment.currency,
    message:'Local simulation only. No money is charged and no card details are needed.',
  };
  return {mode:'payhere-sandbox',...checkoutFields(payment,customer,config),paymentId:payment.id};
}

// Call inside a store transaction, after provider verification or demo authorization.
export function settlePayment(store, paymentId, {status, gatewayId}, notifyAdmins) {
  const payment=store.get('payments',paymentId);
  if(!payment)fail(404,'Payment not found.');
  if(payment.status==='Refunded'||(payment.status==='Paid'&&status!=='Refunded'))return payment;
  const timestamp=new Date().toISOString();
  const updated={...payment,status,gatewayId,updatedAt:timestamp};
  store.save('payments',updated);
  const policy=store.get('policies',payment.policyId);
  if(status==='Paid'&&policy&&!['Cancelled','Suspended'].includes(policy.status)) {
    const start=policy.startDate&&Date.parse(policy.expiryDate)>Date.now()?policy.startDate:timestamp;
    const paidFrom=Math.max(Date.now(),Date.parse(policy.paidThrough)||0);
    store.save('policies',{...policy,status:'Active',paymentStatus:'Paid',startDate:start,
      expiryDate:addMonths(start,12),paidThrough:addMonths(paidFrom,policy.billingCycle==='annual'?12:1)});
  }
  if(status==='Refunded'&&policy)store.save('policies',{...policy,status:'Suspended',paymentStatus:'Refunded'});
  const label=payment.simulated?'Demo payment':'Payment';
  store.notify(payment.owner,label+' '+status.toLowerCase(),payment.id,'Payments','/payments');
  notifyAdmins(label+' '+status.toLowerCase(),payment.id,'Payments','/admin/payments');
  store.audit({id:payment.owner,name:payment.simulated?'Local payment simulator':'PayHere Sandbox',role:'Gateway'},label+' '+status,'Payment',payment.id);
  return updated;
}

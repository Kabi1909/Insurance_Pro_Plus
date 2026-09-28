import { createHash, timingSafeEqual } from 'node:crypto';
import { fail, text } from './security.js';
export const md5 = value => createHash('md5').update(value).digest('hex').toUpperCase();
export function checkoutFields(payment, customer, config) {
  if (!config.merchantId || !config.merchantSecret || !config.notifyUrl) fail(503, 'PayHere sandbox is not configured. Set merchant credentials and a public callback URL on the server.');
  const fields = {
    merchant_id:config.merchantId, return_url:`${config.origin}/payments?order=${payment.id}`,
    cancel_url:`${config.origin}/payments?cancelled=${payment.id}`, notify_url:config.notifyUrl,
    order_id:payment.id, items:payment.policyName, currency:payment.currency, amount:payment.amount.toFixed(2),
    first_name:customer.name.split(' ')[0], last_name:customer.name.split(' ').slice(1).join(' ') || customer.name,
    email:customer.email, phone:text(customer.phone,'Phone',5,40), address:text(customer.address,'Address',3,300),
    city:text(customer.city,'City',2,100), country:text(customer.country,'Country',2,100),
  };
  fields.hash=md5(fields.merchant_id+fields.order_id+fields.amount+fields.currency+md5(config.merchantSecret));
  return { action:'https://sandbox.payhere.lk/pay/checkout', fields };
}
export function verifyNotification(body, payment, config) {
  if (!config.merchantSecret || body.merchant_id !== config.merchantId || body.order_id !== payment.id ||
      body.payhere_currency !== payment.currency || !/^\d+\.\d{2}$/.test(body.payhere_amount || '') ||
      Number(body.payhere_amount) !== payment.amount || !/^[A-Fa-f0-9]{32}$/.test(body.md5sig || '')) return false;
  const expected=md5(body.merchant_id+body.order_id+body.payhere_amount+body.payhere_currency+body.status_code+md5(config.merchantSecret));
  return timingSafeEqual(Buffer.from(expected),Buffer.from(body.md5sig.toUpperCase()));
}

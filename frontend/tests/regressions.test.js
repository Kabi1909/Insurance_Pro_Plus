import test from 'node:test';
import assert from 'node:assert/strict';
import { api, payHereRedirect } from '../src/utils/api.js';
import { readCollection } from '../src/utils/storage.js';

test('API requests use server cookies and surface authorization failures',async t=>{
 const requests=[];t.mock.method(globalThis,'fetch',async(url,options)=>{requests.push({url,options});return new Response(JSON.stringify({error:'Please sign in to continue.'}),{status:401,headers:{'content-type':'application/json'}});});
 await assert.rejects(api('/quotes',{method:'POST',body:{coverage:250000}}),e=>e.status===401&&e.message==='Please sign in to continue.');
 assert.equal(requests[0].url,'/api/quotes');assert.equal(requests[0].options.credentials,'same-origin');assert.equal(JSON.parse(requests[0].options.body).coverage,250000);
});
test('collections are loaded from the API without local demo fallback',async t=>{
 const calls=[];t.mock.method(globalThis,'fetch',async url=>{calls.push(url);return new Response('[]',{status:200});});
 assert.deepEqual(await readCollection('ipp_policies'),[]);assert.deepEqual(await readCollection('ipp_admin_customers'),[]);
 assert.deepEqual(calls,['/api/policies','/api/admin/customers']);
 t.mock.method(globalThis,'fetch',async()=>{throw new Error('Network unavailable');});
 await assert.rejects(readCollection('ipp_policies'),/Network unavailable/);
});
test('checkout refuses live or unexpected payment destinations',()=>{
 for(const action of ['https://www.payhere.lk/pay/checkout','https://example.test/steal','javascript:alert(1)'])assert.throws(()=>payHereRedirect({action,fields:{}}),/Unexpected payment destination/);
});

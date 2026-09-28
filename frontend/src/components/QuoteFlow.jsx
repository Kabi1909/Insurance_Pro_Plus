import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Modal from './admin/Modal';
import { api, money } from '../utils/api';

export default function QuoteFlow({ product, onClose }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [billingCycle,setBillingCycle]=useState(new URLSearchParams(window.location.search).get('cycle')==='annual'?'annual':'monthly');
  const [coverage, setCoverage] = useState('250000');
  const [details, setDetails] = useState('');
  const [quote, setQuote] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const request = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try { setQuote(await api('/quotes', { method:'POST', body:{productId:product.id,accountType:product.type,coverage,details,billingCycle,offer:new URLSearchParams(window.location.search).get('offer')} })); }
    catch(err) { setError(err.message); } finally { setBusy(false); }
  };
  const select = async planId => {
    setBusy(true); setError('');
    try { const policy=await api(`/quotes/${quote.id}/select`,{method:'POST',body:{planId}}); navigate(`/policies/${policy.id}`); }
    catch(err) { setError(err.message); } finally { setBusy(false); }
  };
  return <Modal isOpen title={`Get Quote — ${product.name}`} onClose={onClose} maxWidth="max-w-2xl">
    {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}
    {!user ? <div className="space-y-4"><p>Sign in or create an account to request and save a quote.</p><button onClick={()=>navigate('/login?next='+encodeURIComponent(`/products/${product.id}?quote=1&cycle=${billingCycle}&offer=${new URLSearchParams(window.location.search).get('offer')||''}`))} className="bg-primary text-white px-5 py-2 rounded-lg">Sign In / Register</button></div> : !quote ?
      <form onSubmit={request} className="space-y-4">
        <div><label htmlFor="quote-account" className="block text-sm font-semibold mb-1">Account Type</label><input id="quote-account" readOnly value={product.type} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" /></div>
        <div><label htmlFor="quote-product" className="block text-sm font-semibold mb-1">Insurance Type</label><input id="quote-product" readOnly value={product.name} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" /></div>
        <div><label htmlFor="quote-details" className="block text-sm font-semibold mb-1">{product.type==='Business'?'Business':'Personal'} Details</label><textarea id="quote-details" required minLength={5} maxLength={3000} value={details} onChange={e=>setDetails(e.target.value)} rows={3} className="w-full border border-slate-300 rounded-lg p-2.5" placeholder={product.type==='Business'?'Business name, activities and assets to cover':'Describe what you would like to cover'} /></div>
        <div><label htmlFor="quote-coverage" className="block text-sm font-semibold mb-1">Desired Coverage (USD)</label><input id="quote-coverage" required type="number" min="1000" max="10000000" value={coverage} onChange={e=>setCoverage(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5" /></div>
        <label className="block text-sm font-semibold">Payment frequency<select value={billingCycle} onChange={e=>setBillingCycle(e.target.value)} className="block w-full border border-slate-300 rounded-lg p-2.5 mt-1"><option value="monthly">Monthly</option><option value="annual">Annual — pay for 10 months</option></select></label><p className="text-sm text-slate-500">Estimates use the current configured rates. Final cover is subject to policy terms and verification.</p>
        <button disabled={busy} className="bg-primary text-white px-5 py-2 rounded-lg disabled:opacity-50">{busy?'Calculating...':'Show Plans'}</button>
      </form> : <div className="space-y-4">
        {quote.plans.map(plan=><div key={plan.id} className="border border-slate-200 rounded-xl p-5"><h3 className="font-bold text-lg">{plan.name}</h3><p className="mt-2">Coverage: {money(plan.coverage)}</p><p>Estimated Premium: {money(plan.premium)}/{plan.billingCycle==='annual'?'year':'month'}</p><div className="flex gap-3 mt-4"><button type="button" onClick={()=>setExpanded(expanded===plan.id?null:plan.id)} className="border border-slate-300 rounded-lg px-4 py-2">View Details</button><button disabled={busy} onClick={()=>select(plan.id)} className="bg-primary text-white rounded-lg px-4 py-2 disabled:opacity-50">Select Plan</button></div>{expanded===plan.id&&<div className="mt-4 text-sm text-slate-600"><ul className="list-disc pl-5">{plan.benefits.map(b=><li key={b}>{b}</li>)}</ul><p className="mt-2">Premium in USD for the selected payment frequency. Selecting a plan creates a pending policy. Coverage starts after payment is confirmed.</p></div>}</div>)}
        <button onClick={()=>setQuote(null)} className="text-primary font-semibold">Change quote details</button>
      </div>}
  </Modal>;
}

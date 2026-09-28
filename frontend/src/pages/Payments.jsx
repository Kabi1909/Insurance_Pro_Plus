import { paymentText } from '../utils/paymentText';
import { api, payHereRedirect, download, money } from '../utils/api';
import { showToast } from '../utils/toast';
import { readCollection } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Download, Lock, CheckCircle } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [paymentMode,setPaymentMode]=useState(null);
  const [demoCheckout,setDemoCheckout]=useState(null);
  const [billing, setBilling] = useState({ phone:'', address:'', city:'', country:'' });
  const [formData, setFormData] = useState({
    policyId: '',
    amount: ''
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
    const configuration=await api('/payments/config');
    if(active)setPaymentMode(configuration.mode);
    const storedPayments = await readCollection('ipp_payments');
    if (active) setPayments(storedPayments);
    const storedPolicies = await readCollection('ipp_policies');
    if (active) {
      setPolicies(storedPolicies.filter(p => !['Cancelled', 'Suspended'].includes(p.status)));
      const params=new URLSearchParams(window.location.search);const selected=storedPolicies.find(p=>p.id===params.get('policy'));
      if(selected){setFormData(prev=>({...prev,policyId:selected.id,amount:selected.premiumAmount}));setShowModal(true);}
      if(params.has('order') || params.has('cancelled')) showToast('Payment status is confirmed by PayHere. Refresh the history if confirmation is still pending.', 'info');
    }

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault(); if (busy) return; setBusy(true);
    try {
      const checkout = await api('/payments/checkout', { method:'POST', body:{policyId:formData.policyId, ...(paymentMode==='payhere-sandbox'?billing:{})} });
      if(checkout.mode==='demo')setDemoCheckout(checkout);
      else if(checkout.mode==='payhere-sandbox')payHereRedirect(checkout);
      else throw new Error('Unsupported payment mode.');
    } catch(error) { showToast(error.message, 'error'); }
    finally {setBusy(false);}
  };

  const completeDemoPayment=async()=>{
    if(busy||!demoCheckout)return;setBusy(true);
    try{
      const result=await api('/payments/'+demoCheckout.paymentId+'/demo-complete',{method:'POST',body:{}});
      setPayments(list=>[result.payment,...list.filter(p=>p.id!==result.payment.id)]);
      setPolicies(list=>list.map(p=>p.id===result.policy.id?result.policy:p));
      setDemoCheckout(null);setShowModal(false);
      showToast('Payment successful! Your policy is now active.');
    }catch(error){showToast(error.message,'error');}finally{setBusy(false);}
  };

  const getStatusBadge = (status) => {
    if(status === 'Completed') return 'bg-green-100 text-green-800';
    if(status === 'Pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-textMain">Payments</h1>
        <button
          onClick={() => {setDemoCheckout(null);setShowModal(true);}}
          className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <CreditCard className="h-4 w-4" />
          Make New Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 text-primary rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-textSecondary font-medium">Pending Premiums</p>
            <p className="text-2xl font-bold text-textMain">{money(policies.filter(p=>p.status==='Pending Payment').reduce((sum,p)=>sum+p.premiumAmount,0))}</p>
            <p className="text-xs text-textSecondary">For policies awaiting payment</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 text-success rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-textSecondary font-medium">Total Paid This Year</p>
            <p className="text-2xl font-bold text-textMain">{money(payments.filter(p=>p.status==='Completed' && new Date(p.date).getFullYear()===new Date().getFullYear()).reduce((sum,p)=>sum+p.amountValue,0))}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="flex-1">
             <p className="text-sm text-textSecondary font-medium mb-1">Primary Payment Method</p>
             <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-primary text-xs font-bold px-2 py-0.5 rounded">PayHere</span>
                <span className="text-sm font-medium">{paymentMode==='demo'?'Online payments':'Sandbox checkout'}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-borderMain shadow-sm overflow-hidden">
        <div className="p-5 border-b border-borderMain">
          <h2 className="text-lg font-bold text-textMain">Payment History</h2><button onClick={async()=>{try{setPayments(await api('/payments'));}catch(error){showToast(error.message,'error');}}} className="text-primary text-sm">Refresh status</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-borderMain text-xs uppercase text-textSecondary font-medium">
                <th className="p-4">Payment ID</th>
                <th className="p-4">Policy</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderMain text-sm">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-textMain">{payment.id}</td>
                  <td className="p-4 text-textSecondary">{payment.policy}</td>
                  <td className="p-4 text-textMain">{payment.date}</td>
                  <td className="p-4 text-textSecondary">{payment.simulated?'PayHere':paymentText(payment.method)}</td>
                  <td className="p-4 font-medium">{payment.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button disabled={payment.status !== "Completed"} onClick={() => download(`/payments/${payment.id}/download`)} aria-label="Download payment receipt" className="text-primary hover:text-primary-dark p-1 disabled:opacity-40">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <h2 className="text-xl font-bold text-textMain mb-4">{demoCheckout?'PayHere Checkout':'Make a Payment'}</h2>

            {demoCheckout ? <div className="space-y-4">
              <p className="text-sm text-textSecondary">Review your payment details before continuing.</p>
              <div className="bg-gray-50 p-4 rounded-lg border border-borderMain"><p className="text-sm">Policy: {demoCheckout.policyId}</p><p className="font-bold mt-2">Amount: {money(demoCheckout.amount)} {demoCheckout.currency}</p><p className="text-sm mt-2">Your policy stays Pending Payment until you complete this payment.</p></div>
              <div className="flex justify-end gap-3"><button disabled={busy} onClick={()=>{setDemoCheckout(null);setShowModal(false);}} className="px-4 py-2 border border-borderMain rounded-md">Cancel</button><button disabled={busy} onClick={completeDemoPayment} className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50">{busy?'Processing…':'Complete Payment'}</button></div>
            </div> : <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMain mb-1">Select Policy</label>
                <select
                  required
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={formData.policyId}
                  onChange={e => setFormData({...formData, policyId: e.target.value, amount: policies.find(p => p.id === e.target.value)?.premiumAmount || ""})}
                >
                  <option value="">Select...</option>
                  {policies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-textMain mb-1">Amount ($)</label>
                <input
                  required
                  type="number" readOnly
                  min="1"
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div><label className="block text-sm font-medium text-textMain mb-2">Payment Method</label><p className="text-sm">{paymentMode==='demo'?'PayHere':paymentMode==='payhere-sandbox'?'PayHere Sandbox — choose a test payment method at checkout.':'Loading payment configuration…'}</p></div>

              {paymentMode==='payhere-sandbox'&&<div className="bg-gray-50 p-4 rounded-lg border border-borderMain space-y-3 mt-4">
                <p className="text-sm text-textSecondary">Pay securely on PayHere Sandbox. Enter test billing details below; card information is entered only on PayHere.</p>
                {['phone','address','city','country'].map(key => <label key={key} className="block text-xs font-medium text-textMain capitalize">{key}<input required value={billing[key]} onChange={e=>setBilling({...billing,[key]:e.target.value})} className="mt-1 w-full border border-borderMain rounded px-2 py-1.5 text-sm" /></label>)}
              </div>}

              <div className="flex justify-end gap-3 pt-4 border-t border-borderMain">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={busy||!paymentMode} className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark flex items-center gap-2">
                  <Lock className="h-4 w-4" /> {paymentMode==='demo'?'Continue to Checkout':'Continue to PayHere Sandbox'}
                </button>
              </div>
            </form>}
          </div>
        </div>
      )}


    </div>
  );
};

export default Payments;

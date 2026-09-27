import { readCollection } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Download, Lock, CheckCircle } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    policyId: '',
    amount: '',
    method: 'Credit Card',
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const storedPayments = readCollection('ipp_payments');
    setPayments(storedPayments);
    const storedPolicies = readCollection('ipp_policies');
    setPolicies(storedPolicies.filter(p => p.status === 'Active'));
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    setShowModal(false);
    
    // Simulate processing
    setTimeout(() => {
      const newPayment = {
        id: `PAY-${Date.now().toString().slice(-4)}`,
        policy: policies.find(p => p.id === formData.policyId)?.name || 'Insurance Premium',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `$${formData.amount}`,
        method: formData.method,
        status: 'Completed'
      };
      
      const updatedPayments = [newPayment, ...payments];
      setPayments(updatedPayments);
      localStorage.setItem('ipp_payments', JSON.stringify(updatedPayments));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({ policyId: '', amount: '', method: 'Credit Card', name: '', number: '', expiry: '', cvv: '' });
    }, 1500);
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
          onClick={() => setShowModal(true)}
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
            <p className="text-sm text-textSecondary font-medium">Next Payment</p>
            <p className="text-2xl font-bold text-textMain">$250</p>
            <p className="text-xs text-textSecondary">Due Dec 15, 2026</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 text-success rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-textSecondary font-medium">Total Paid This Year</p>
            <p className="text-2xl font-bold text-textMain">$1,850</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="flex-1">
             <p className="text-sm text-textSecondary font-medium mb-1">Primary Payment Method</p>
             <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-primary text-xs font-bold px-2 py-0.5 rounded">VISA</span>
                <span className="text-sm font-medium">•••• 4242</span>
             </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-borderMain shadow-sm overflow-hidden">
        <div className="p-5 border-b border-borderMain">
          <h2 className="text-lg font-bold text-textMain">Payment History</h2>
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
                  <td className="p-4 text-textSecondary">{payment.method}</td>
                  <td className="p-4 font-medium">{payment.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-primary hover:text-primary-dark p-1">
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
            <h2 className="text-xl font-bold text-textMain mb-4">Make a Payment</h2>
            
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMain mb-1">Select Policy</label>
                <select 
                  required
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={formData.policyId}
                  onChange={e => setFormData({...formData, policyId: e.target.value})}
                >
                  <option value="">Select...</option>
                  {policies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-textMain mb-1">Amount ($)</label>
                <input 
                  required
                  type="number" 
                  min="1"
                  className="w-full border border-borderMain rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-textMain mb-2">Payment Method</label>
                 <div className="flex gap-4">
                   <label className="flex items-center gap-2 text-sm">
                     <input type="radio" name="method" checked={formData.method === 'Credit Card'} onChange={() => setFormData({...formData, method: 'Credit Card'})} className="text-primary focus:ring-primary" />
                     Credit/Debit Card
                   </label>
                   <label className="flex items-center gap-2 text-sm">
                     <input type="radio" name="method" checked={formData.method === 'Bank Transfer'} onChange={() => setFormData({...formData, method: 'Bank Transfer'})} className="text-primary focus:ring-primary" />
                     Bank Transfer
                   </label>
                 </div>
              </div>

              {formData.method === 'Credit Card' && (
                <div className="bg-gray-50 p-4 rounded-lg border border-borderMain space-y-3 mt-4">
                  <div>
                    <label className="block text-xs font-medium text-textMain mb-1">Cardholder Name</label>
                    <input required type="text" className="w-full border border-borderMain rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-textMain mb-1">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full border border-borderMain rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-textMain mb-1">Expiry</label>
                      <input required type="text" placeholder="MM/YY" className="w-full border border-borderMain rounded px-2 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-textMain mb-1">CVV</label>
                      <input required type="password" placeholder="123" className="w-full border border-borderMain rounded px-2 py-1.5 text-sm" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-borderMain">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Pay Securely
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="font-medium text-sm">Payment Successful</span>
        </div>
      )}

    </div>
  );
};

export default Payments;

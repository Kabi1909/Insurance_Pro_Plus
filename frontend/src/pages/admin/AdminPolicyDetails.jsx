import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, User, DollarSign, Calendar, FileText, CheckCircle, AlertTriangle, FileCheck, XCircle } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../utils/toast';

const AdminPolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showSuspend, setShowSuspend] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('ipp_admin_policies') || '[]');
    const found = data.find(p => p.number === id);
    if (found) setPolicy(found);
  }, [id]);

  if (!policy) return <div className="p-8 text-center text-slate-500">Loading policy details...</div>;

  const handleAction = (action, confirmStateSetter) => {
    const newStatus = action === 'Suspend' ? 'Suspended' : 'Cancelled';
    const data = JSON.parse(localStorage.getItem('ipp_admin_policies') || '[]');
    const updated = data.map(p => p.number === id ? { ...p, status: newStatus } : p);
    localStorage.setItem('ipp_admin_policies', JSON.stringify(updated));
    setPolicy({ ...policy, status: newStatus });
    confirmStateSetter(false);
    showToast(`Policy ${newStatus.toLowerCase()} successfully.`, 'warning');
  };

  const tabs = ['Overview', 'Coverage', 'Payments', 'Claims', 'Documents', 'Activity'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <button onClick={() => navigate('/admin/policies')} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-2 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Policies
          </button>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 shadow-inner">
               <Shield className="h-6 w-6" />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                 {policy.number}
                 <StatusBadge status={policy.status} />
               </h1>
               <p className="text-slate-500">{policy.type} Insurance • <span className="font-medium text-blue-600">{policy.holder}</span></p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Edit Policy
           </button>
           <button className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
             Renew Policy
           </button>
           <button 
             onClick={() => setShowSuspend(true)}
             disabled={policy.status !== 'Active'}
             className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium disabled:opacity-50"
           >
             Suspend Policy
           </button>
           <button 
             onClick={() => setShowCancel(true)}
             disabled={policy.status !== 'Active'}
             className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
           >
             Cancel Policy
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center"><Shield className="h-5 w-5 text-blue-600"/></div>
          <div><p className="text-sm text-slate-500">Coverage Amount</p><p className="text-xl font-bold text-slate-900">LKR {(policy.coverage/1000000).toFixed(1)}M</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600"/></div>
          <div><p className="text-sm text-slate-500">Premium</p><p className="text-xl font-bold text-slate-900">LKR {policy.premium.toLocaleString()}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center"><Calendar className="h-5 w-5 text-slate-600"/></div>
          <div><p className="text-sm text-slate-500">Expiry Date</p><p className="text-xl font-bold text-slate-900">{policy.expiryDate}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center"><CheckCircle className="h-5 w-5 text-blue-600"/></div>
          <div><p className="text-sm text-slate-500">Payment Status</p><p className="text-xl font-bold text-slate-900">{policy.paymentStatus}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto hide-scrollbar px-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileText className="h-5 w-5 text-blue-600" /> Policy Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Policy Number</span>
                    <span className="text-sm font-bold text-slate-900">{policy.number}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Policy Holder</span>
                    <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">{policy.holder}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Customer ID</span>
                    <span className="text-sm font-medium text-slate-900">CUS-10291</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Start Date</span>
                    <span className="text-sm font-medium text-slate-900">{policy.startDate}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-sm font-medium text-slate-500">Payment Frequency</span>
                    <span className="text-sm font-medium text-slate-900">Annually</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Calendar className="h-5 w-5 text-blue-600" /> Policy Timeline
                </h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent pl-4">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-blue-500 bg-white shadow shrink-0 z-10"></div>
                    <div className="w-[calc(100%-2rem)] p-4 rounded-xl border border-blue-200 bg-blue-50 shadow-sm ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-sm">Policy Activated</div>
                        <div className="text-xs text-blue-600 font-medium">{policy.startDate}</div>
                      </div>
                      <div className="text-slate-600 text-xs">Payment received and policy is now active.</div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-slate-300 bg-white shadow shrink-0 z-10"></div>
                    <div className="w-[calc(100%-2rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm ml-4 opacity-50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-sm">Renewal Due</div>
                        <div className="text-xs text-slate-500 font-medium">{policy.expiryDate}</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="py-12 text-center text-slate-500">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Shield className="h-8 w-8 text-slate-400" />
               </div>
               <p>This section displays associated {activeTab.toLowerCase()} data for this policy.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showSuspend} 
        title="Suspend Policy?"
        message={`Are you sure you want to suspend policy ${policy.number}? Coverage will be temporarily halted.`}
        onConfirm={() => handleAction('Suspend', setShowSuspend)} 
        onCancel={() => setShowSuspend(false)} 
        confirmText="Suspend Policy"
        type="warning"
      />
      <ConfirmDialog 
        isOpen={showCancel} 
        title="Cancel Policy?"
        message={`Are you sure you want to completely cancel policy ${policy.number}? This action cannot be easily undone.`}
        onConfirm={() => handleAction('Cancel', setShowCancel)} 
        onCancel={() => setShowCancel(false)} 
        confirmText="Cancel Policy"
        type="danger"
      />
    </div>
  );
};

export default AdminPolicyDetails;

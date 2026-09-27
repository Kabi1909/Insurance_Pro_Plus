import MissingRecord from '../../components/MissingRecord';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Phone, MapPin, Briefcase, FileText, AlertCircle, DollarSign, Calendar, Building } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../utils/toast';

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showSuspend, setShowSuspend] = useState(false);

  useEffect(() => {
    const data = readCollection('ipp_admin_customers');
    const found = data.find(c => c.id === id);
    setCustomer(found || null);
  }, [id]);

  if (!customer) return <MissingRecord label="Customer" backTo="/admin/customers" />;

  const handleSuspend = () => {
    const isSuspending = customer.status === 'Active';
    const newStatus = isSuspending ? 'Suspended' : 'Active';
    
    const data = readCollection('ipp_admin_customers');
    const updated = data.map(c => c.id === id ? { ...c, status: newStatus } : c);
    localStorage.setItem('ipp_admin_customers', JSON.stringify(updated));
    setCustomer({ ...customer, status: newStatus });
    setShowSuspend(false);
    showToast(`Customer account ${newStatus.toLowerCase()} successfully.`, isSuspending ? 'warning' : 'success');
  };

  const tabs = ['Overview', 'Policies', 'Claims', 'Payments', 'Documents', 'Activity'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <button onClick={() => navigate('/admin/customers')} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-2 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Customers
          </button>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0 shadow-inner">
               {customer.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                 {customer.name}
                 <StatusBadge status={customer.status} />
               </h1>
               <p className="text-slate-500">{customer.id} • {customer.type} Account</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Edit Customer
           </button>
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Contact Customer
           </button>
           <button 
             onClick={() => setShowSuspend(true)}
             className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm ${customer.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
           >
             {customer.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center"><FileText className="h-5 w-5 text-blue-600"/></div>
          <div><p className="text-sm text-slate-500">Active Policies</p><p className="text-xl font-bold text-slate-900">{customer.policies}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center"><AlertCircle className="h-5 w-5 text-yellow-600"/></div>
          <div><p className="text-sm text-slate-500">Open Claims</p><p className="text-xl font-bold text-slate-900">0</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-600"/></div>
          <div><p className="text-sm text-slate-500">Total Premium</p><p className="text-xl font-bold text-slate-900">LKR {customer.totalPremium.toLocaleString()}</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center"><FileText className="h-5 w-5 text-slate-600"/></div>
          <div><p className="text-sm text-slate-500">Documents</p><p className="text-xl font-bold text-slate-900">3</p></div>
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
              {/* Profile Details */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  {customer.type === 'Business' ? <Building className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-blue-600" />} 
                  {customer.type === 'Business' ? 'Business Information' : 'Personal Information'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><User className="h-4 w-4 text-slate-400" /> <span className="text-slate-500 w-32 text-sm">Full Name</span> <span className="font-semibold text-slate-900 text-sm">{customer.name}</span></div>
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-slate-400" /> <span className="text-slate-500 w-32 text-sm">Email</span> <span className="font-medium text-blue-600 text-sm">{customer.email}</span></div>
                  <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-slate-400" /> <span className="text-slate-500 w-32 text-sm">Phone</span> <span className="font-medium text-slate-900 text-sm">+94 77 123 4567</span></div>
                  <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-slate-400 mt-0.5" /> <span className="text-slate-500 w-32 text-sm">Address</span> <span className="font-medium text-slate-900 text-sm">123 Galle Road<br/>Colombo 03, Sri Lanka</span></div>
                  <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-slate-400" /> <span className="text-slate-500 w-32 text-sm">Joined Date</span> <span className="font-medium text-slate-900 text-sm">{customer.joined}</span></div>
                  
                  {customer.type === 'Business' && (
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-50"><Briefcase className="h-4 w-4 text-slate-400" /> <span className="text-slate-500 w-32 text-sm">Reg Number</span> <span className="font-medium text-slate-900 text-sm">PV 98765</span></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="py-12 text-center text-slate-500">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="h-8 w-8 text-slate-400" />
               </div>
               <p>This section displays associated {activeTab.toLowerCase()} data for this customer.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showSuspend} 
        title={customer.status === 'Active' ? "Suspend Customer Account?" : "Activate Customer Account?"}
        message={customer.status === 'Active' 
          ? `Are you sure you want to suspend ${customer.name}? Their policies will remain active but they will lose portal access.` 
          : `Are you sure you want to reactivate ${customer.name}'s account?`}
        onConfirm={handleSuspend} 
        onCancel={() => setShowSuspend(false)} 
        confirmText={customer.status === 'Active' ? "Suspend Account" : "Activate Account"}
        type={customer.status === 'Active' ? "danger" : "success"}
      />
    </div>
  );
};

export default AdminCustomerDetails;

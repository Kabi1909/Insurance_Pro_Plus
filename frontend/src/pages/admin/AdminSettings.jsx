import { api } from '../../utils/api';
import PasswordDialog from '../../components/PasswordDialog';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Building, Shield, Bell, CreditCard, Lock, Users, Save, Check } from 'lucide-react';
import { showToast } from '../../utils/toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('Company Profile');

  const [settings,setSettings]=useState(null);const [products,setProducts]=useState([]);const [gateway,setGateway]=useState(null);const [error,setError]=useState('');const [passwordOpen,setPasswordOpen]=useState(false);
  useEffect(()=>{let active=true;Promise.all([api('/admin/settings'),api('/products'),api('/admin/payment-config')]).then(([s,p,g])=>{if(active){setSettings(s);setProducts(p);setGateway(g);}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);
  const tabs = [
    { name: 'Company Profile', icon: Building },
    { name: 'Insurance Categories', icon: Shield },
    { name: 'Claim Settings', icon: Check },
    { name: 'Payment Settings', icon: CreditCard },
    { name: 'Notification Settings', icon: Bell },
    { name: 'Security', icon: Lock },
    { name: 'Roles & Permissions', icon: Users },
  ];

  const handleSave = async (e) => {e.preventDefault();try{const fields=Object.fromEntries(new FormData(e.currentTarget));const rates={};for(const p of products)if(fields[p.id]!==undefined){rates[p.id]=Number(fields[p.id]);delete fields[p.id];}const saved=await api('/admin/settings',{method:'PATCH',body:{...fields,...(Object.keys(rates).length?{rates}:{})}});setSettings(saved);showToast('Settings saved.');}catch(e){showToast(e.message,'error');}};
  if(error)return <p role="alert" className="p-6">{error}</p>;
  if(!settings)return <p className="p-6">Loading settings…</p>;

  return (
    <div className="space-y-6">{passwordOpen&&<PasswordDialog onClose={()=>setPasswordOpen(false)}/>}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-500">Configure global platform preferences and system behaviors.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Vertical Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex flex-col gap-1 sticky top-24">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">{activeTab}</h2>
            </div>

            <div className="p-6">
              {activeTab === 'Company Profile' && (
                <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                      <input type="text" name="companyName" defaultValue={settings.companyName||''} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Company Registration Number</label>
                      <input type="text" name="registrationNumber" defaultValue={settings.registrationNumber||''} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Business Email</label>
                      <input type="email" name="email" defaultValue={settings.email||''} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                      <input type="text" name="phone" defaultValue={settings.phone||''} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                    <textarea name="address" defaultValue={settings.address||''} rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                      <Save className="h-4 w-4" /> Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'Security' && <div className="space-y-6 max-w-2xl"><h3 className="font-semibold text-lg">Authentication & sessions</h3><p className="text-slate-600">Passwords are securely hashed. Sign-in attempts are limited to 10 per email and IP in 15 minutes. Sessions expire after 12 hours, or 30 days when Remember Me is selected.</p><button onClick={()=>setPasswordOpen(true)} className="px-4 py-2 border border-slate-300 rounded-lg">Change Admin Password</button></div>}
              {activeTab === 'Insurance Categories' && <form onSubmit={handleSave} className="space-y-4 max-w-2xl"><p className="text-slate-500">Monthly estimated premium = coverage × rate, subject to the minimum premium. Changes apply to new quotes.</p>{products.map(p=><label key={p.id} className="block text-sm font-semibold">{p.name}<input name={p.id} type="number" required min="0.00001" max="0.1" step="0.00001" defaultValue={settings.rates[p.id]} className="block w-full border border-slate-300 rounded-lg p-2 mt-1"/></label>)}<label className="block text-sm font-semibold">Minimum premium (USD)<input name="minPremium" type="number" min="1" step="0.01" required defaultValue={settings.minPremium} className="block w-full border border-slate-300 rounded-lg p-2"/></label><button className="bg-blue-600 text-white rounded-lg px-5 py-2">Save estimated rates</button></form>}
              {activeTab === 'Claim Settings' && <div className="space-y-4 text-slate-600"><p>Claims require an active policy. The requested amount cannot exceed coverage and the incident date must fall within the policy period.</p><p>Officers can request information, assign claims and record internal notes. Approved or rejected decisions are final.</p><Link to="/admin/claims" className="text-blue-600">Manage claims</Link></div>}
              {activeTab === 'Payment Settings' && <div className="space-y-4 text-slate-600"><h3 className="font-semibold text-lg">{gateway?.simulated?'PayHere · Simulated · USD':'PayHere Sandbox · USD'}</h3><p>{gateway?.simulated?'Local checkout is enabled. No merchant credentials or card details are required.':gateway?.configured?'The sandbox gateway is configured.':'Sandbox credentials and a public notification URL are required on the server before checkout is available.'}</p><p>{gateway?.simulated?'Completing checkout records a simulated payment and activates the test policy. No money is charged.':'Payment is recorded only after a verified PayHere notification. No card details are stored here.'}</p><Link to="/admin/payments" className="text-blue-600">View payments</Link></div>}
              {activeTab === 'Notification Settings' && <div className="space-y-4 text-slate-600"><p>In-app notifications are created for registrations, policies, payments, claims, documents and support requests.</p><Link to="/admin/notifications" className="text-blue-600">Manage notifications</Link></div>}
              {activeTab === 'Roles & Permissions' && <div className="space-y-4 text-slate-600"><p>System administrators manage staff, customer access and platform settings. Staff can review operational records; claim, finance and support actions follow their assigned role.</p><Link to="/admin/staff" className="text-blue-600">Manage staff accounts</Link></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

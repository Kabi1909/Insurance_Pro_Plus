import React, { useState } from 'react';
import { Building, Shield, Bell, CreditCard, Lock, Users, Save, Check } from 'lucide-react';
import { showToast } from '../../utils/toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('Company Profile');

  const tabs = [
    { name: 'Company Profile', icon: Building },
    { name: 'Insurance Categories', icon: Shield },
    { name: 'Claim Settings', icon: Check },
    { name: 'Payment Settings', icon: CreditCard },
    { name: 'Notification Settings', icon: Bell },
    { name: 'Security', icon: Lock },
    { name: 'Roles & Permissions', icon: Users },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully.');
  };

  return (
    <div className="space-y-6">
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
                      <input type="text" defaultValue="Insurance Pro Plus" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Company Registration Number</label>
                      <input type="text" defaultValue="PV 123456" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Business Email</label>
                      <input type="email" defaultValue="contact@insuranceproplus.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                      <input type="text" defaultValue="+94 11 234 5678" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Address</label>
                    <textarea defaultValue="123 Financial District, Colombo 01, Sri Lanka" rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                  <div>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                      <Save className="h-4 w-4" /> Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'Security' && (
                <div className="space-y-8 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
                          <p className="text-sm text-slate-500">Require all staff to use 2FA to access the admin portal.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">Login Attempt Limit</p>
                          <p className="text-sm text-slate-500">Lock account after 5 failed attempts.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Session Management</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-semibold text-slate-700 mb-1">Session Timeout</label>
                         <select className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                           <option>15 minutes</option>
                           <option>30 minutes</option>
                           <option selected>1 hour</option>
                           <option>4 hours</option>
                         </select>
                       </div>
                    </div>
                  </div>
                  
                  <div>
                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                      Change Admin Password
                    </button>
                  </div>
                </div>
              )}

              {/* Placholders for other tabs to save space, but visually rich enough */}
              {['Insurance Categories', 'Claim Settings', 'Payment Settings', 'Notification Settings', 'Roles & Permissions'].includes(activeTab) && (
                <div className="py-12 text-center max-w-lg mx-auto">
                   <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Lock className="h-8 w-8 text-blue-500" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">{activeTab} configuration</h3>
                   <p className="text-slate-500">This module is part of the advanced backend configuration. The UI is prepared and awaiting backend integration.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

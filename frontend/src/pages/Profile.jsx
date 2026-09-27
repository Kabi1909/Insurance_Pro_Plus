import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Globe, Briefcase, Phone, Save, Lock, Bell, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-textMain">Profile Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-6 border-b border-borderMain pb-2">Personal Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <button className="bg-white border border-borderMain text-textMain px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 mb-2">Change Picture</button>
                <p className="text-xs text-textSecondary">JPG, PNG under 2MB</p>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                    <input type="text" defaultValue={user.name} className="w-full pl-9 pr-3 py-2 border border-borderMain rounded-md text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                    <input type="email" defaultValue={user.email} className="w-full pl-9 pr-3 py-2 border border-borderMain rounded-md text-sm focus:ring-2 focus:ring-primary outline-none" disabled />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                    <input type="tel" defaultValue={user.phone} className="w-full pl-9 pr-3 py-2 border border-borderMain rounded-md text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMain mb-1">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                    <input type="text" defaultValue={user.country} className="w-full pl-9 pr-3 py-2 border border-borderMain rounded-md text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                </div>
              </div>

              {user.accountType === 'Business' && (
                <div className="pt-4 border-t border-borderMain mt-4">
                  <h3 className="text-sm font-bold text-textMain mb-4">Business Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-textMain mb-1">Business Name</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                      <input type="text" defaultValue={user.businessName} className="w-full pl-9 pr-3 py-2 border border-borderMain rounded-md text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button type="button" className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark flex items-center gap-2 transition-colors">
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security & Notifications */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-4 border-b border-borderMain pb-2">Security</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 border border-borderMain rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-textSecondary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-textMain">Change Password</p>
                    <p className="text-xs text-textSecondary">Update your login password</p>
                  </div>
                </div>
              </button>
              <div className="p-3 border border-borderMain rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-textSecondary" />
                    <p className="text-sm font-medium text-textMain">Two-Factor Auth</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-xs text-textSecondary pl-8">Add an extra layer of security to your account.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-4 border-b border-borderMain pb-2">Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'Policy Renewals', defaultChecked: true },
                { label: 'Claim Updates', defaultChecked: true },
                { label: 'Payment Receipts', defaultChecked: true },
                { label: 'Marketing & Offers', defaultChecked: false },
              ].map((pref, idx) => (
                <label key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-textMain">{pref.label}</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.defaultChecked} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;

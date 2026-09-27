import React, { useContext, useState } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import { User, Mail, Briefcase, Phone, Lock, Edit, CheckCircle } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { showToast } from '../../utils/toast';

const AdminProfile = () => {
  const { admin, updateProfile } = useContext(AdminAuthContext);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEditProfile = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name').trim();
    if (!name) return showToast('Full name is required.', 'error');
    try {
      updateProfile({ name, phone: data.get('phone').trim() });
      setShowEdit(false);
      showToast('Profile updated successfully.');
    } catch (error) { showToast(error.message, 'error'); }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowPassword(false);
    showToast('Password changes are unavailable in this demo. Your password has not changed.', 'warning');
  };

  if (!admin) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-500">Manage your administration account details and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 text-center">
          <div className="h-24 w-24 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4 shadow-inner">
            {admin.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{admin.name}</h2>
          <p className="text-slate-500 font-medium mb-1">{admin.role}</p>
          <p className="text-xs text-slate-400 mb-4">{admin.department}</p>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200 mb-6">
            Active
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowEdit(true)} className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
              <Edit className="h-4 w-4" /> Edit Profile
            </button>
            <button onClick={() => setShowPassword(true)} className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
              <Lock className="h-4 w-4" /> Change Password
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="h-5 w-5 text-blue-600" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><User className="h-4 w-4" /> Full Name</p>
                <p className="font-semibold text-slate-900">{admin.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Employee ID</p>
                <p className="font-semibold text-slate-900">{admin.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Mail className="h-4 w-4" /> Work Email</p>
                <p className="font-semibold text-slate-900">{admin.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</p>
                <p className="font-semibold text-slate-900">{admin.phone || "+94 77 000 0000"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Role</p>
                <p className="font-semibold text-slate-900">{admin.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-2"><Building className="h-4 w-4" /> Department</p>
                <p className="font-semibold text-slate-900">{admin.department}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="h-5 w-5 text-blue-600" /> Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Account Created</p>
                <p className="font-semibold text-slate-900">Jan 01, 2020</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Last Login</p>
                <p className="font-semibold text-slate-900">Just now</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Last Password Change</p>
                <p className="font-semibold text-slate-900">3 months ago</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Two-Factor Authentication</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">Unavailable in demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
         <form onSubmit={handleEditProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required defaultValue={admin.name} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="text" name="phone" defaultValue={admin.phone || "+94 77 000 0000"} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div className="pt-4 flex justify-end gap-3">
               <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Save Changes</button>
            </div>
         </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={showPassword} onClose={() => setShowPassword(false)} title="Change Password">
         <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Password Requirements:</p>
              <ul className="text-xs text-slate-500 space-y-1 ml-4 list-disc">
                <li>Minimum 8 characters</li>
                <li>Uppercase & lowercase letter</li>
                <li>Number</li>
                <li>Special character</li>
              </ul>
            </div>
            <div className="pt-2 flex justify-end gap-3">
               <button type="button" onClick={() => setShowPassword(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Change Password</button>
            </div>
         </form>
      </Modal>

    </div>
  );
};

// Also define Building component inline as it was missing from lucide import
const Building = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;

export default AdminProfile;

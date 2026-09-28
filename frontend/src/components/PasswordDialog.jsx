import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import React, { useState } from 'react';
import Modal from './admin/Modal';
import { api } from '../utils/api';
import { showToast } from '../utils/toast';
export default function PasswordDialog({ onClose }) {
  const {updateProfile}=useContext(AuthContext);
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));if(data.newPassword!==data.confirmPassword)return setError('Passwords do not match.');setBusy(true);try{await api('/auth/password',{method:'POST',body:data});await updateProfile({});showToast('Password updated. Other sessions have been signed out.');onClose();}catch(err){setError(err.message);}finally{setBusy(false);}};
  return <Modal isOpen onClose={onClose} title="Change Password"><form onSubmit={submit} className="space-y-4">{error&&<p role="alert" className="text-red-600">{error}</p>}{[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([name,label])=><label key={name} className="block text-sm font-medium">{label}<input name={name} type="password" autoComplete={name==='currentPassword'?'current-password':'new-password'} minLength={8} maxLength={128} required className="mt-1 w-full border border-slate-300 rounded-lg p-2.5" /></label>)}<p className="text-sm text-slate-500">Use at least 8 characters, uppercase, lowercase and a number.</p><button disabled={busy} className="bg-primary text-white rounded-lg px-4 py-2">Change Password</button></form></Modal>;
}

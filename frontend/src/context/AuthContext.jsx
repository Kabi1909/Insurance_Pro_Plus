import React, { createContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { showToast } from '../utils/toast';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    api('/auth/me').then(value => { if (active) setAccount(value); }).catch(error => showToast(error.message, 'error')).finally(() => { if (active) setLoading(false); });
    // Discard the old demo sessions; authentication now comes from the server.
    try { for (const storage of [localStorage, sessionStorage]) {
      for (const key of Object.keys(storage)) if (key.startsWith('ipp_')) storage.removeItem(key);
    }} catch { /* Storage can be blocked; server sessions do not depend on it. */ }
    return () => { active = false; };
  }, []);
  const login = async (email, password, remember = false, adminOnly = false) => {
    const value = await api('/auth/login', { method: 'POST', body: { email, password, remember, adminOnly } });
    setAccount(value); return value;
  };
  const updateProfile = async fields => {
    const value = await api('/auth/profile', { method: 'PATCH', body: fields });
    setAccount(value); return value;
  };
  const uploadAvatar = async file => {if(file.size>2*1024*1024)throw new Error('Maximum image size is 2 MB.');const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(new Error('Unable to read image.'));reader.readAsDataURL(file);});const value=await api('/auth/avatar',{method:'POST',body:{base64}});setAccount(value);};
  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST', body: {} }); setAccount(null); }
    catch (error) { showToast(error.message, 'error'); }
  };
  return <AuthContext.Provider value={{ user: account?.kind === 'customer' ? account : null, admin: account?.kind === 'admin' ? account : null, account, login, logout, updateProfile, uploadAvatar, loading }}>{children}</AuthContext.Provider>;
};

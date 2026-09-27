import React, { createContext, useState } from 'react';
import { ADMIN_EMAIL, isAdminCredentials } from '../utils/credentials';
import { readSession, writeSession, clearSession } from '../utils/session';

export const AdminAuthContext = createContext();
export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = readSession('ipp_admin');
    return stored?.email === ADMIN_EMAIL && stored?.role === 'System Administrator' ? stored : null;
  });
  const login = async (email, password, remember = false) => {
    if (!isAdminCredentials(email, password)) throw new Error('Invalid email or password.');
    const adminData = {
      name: 'Insurance Pro Plus Admin', email: ADMIN_EMAIL,
      role: 'System Administrator', department: 'Administration',
      status: 'Active', id: 'ADM-001',
    };
    writeSession('ipp_admin', adminData, remember);
    setAdmin(adminData);
    return adminData;
  };
  const logout = () => { clearSession('ipp_admin'); setAdmin(null); };
  return <AdminAuthContext.Provider value={{ admin, login, logout, loading: false }}>{children}</AdminAuthContext.Provider>;
};

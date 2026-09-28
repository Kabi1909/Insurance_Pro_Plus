import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';
export const AdminAuthContext = createContext();
export const AdminAuthProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  return <AdminAuthContext.Provider value={{ admin: auth.admin, loading: auth.loading, login: (email, password, remember) => auth.login(email, password, remember, true), logout: auth.logout, updateProfile: auth.updateProfile }}>{children}</AdminAuthContext.Provider>;
};

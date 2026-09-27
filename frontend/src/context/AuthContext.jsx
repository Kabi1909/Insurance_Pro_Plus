import React, { createContext, useState } from 'react';
import { readSession, writeSession, clearSession, updateSession } from '../utils/session';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readSession('ipp_user'));
  const login = (userData, remember = false) => {
    writeSession('ipp_user', userData, remember);
    setUser(userData);
  };
  const updateProfile = (fields) => {
    const updated = { ...user, ...fields };
    updateSession('ipp_user', updated);
    setUser(updated);
  };
  const logout = () => { clearSession('ipp_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, updateProfile, loading: false }}>{children}</AuthContext.Provider>;
};

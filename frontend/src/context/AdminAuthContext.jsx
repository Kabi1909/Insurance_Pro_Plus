import React, { createContext, useState, useEffect } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('ipp_admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        if (cleanEmail === 'admin@insuranceproplus.com' && cleanPassword === 'Admin@123') {
          const adminData = {
            name: 'Insurance Pro Plus Admin',
            email: 'admin@insuranceproplus.com',
            role: 'System Administrator',
            department: 'Administration',
            status: 'Active',
            id: 'ADM-001'
          };
          setAdmin(adminData);
          localStorage.setItem('ipp_admin', JSON.stringify(adminData));
          resolve(adminData);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('ipp_admin');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};

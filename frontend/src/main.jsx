import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'

import { initializeDemoData } from './utils/demoData';
import { initializeAdminDemoData } from './utils/adminDemoData';

// Seed before route effects read storage, including direct links and refreshes.
try {
  initializeDemoData();
  initializeAdminDemoData();
} catch {
  // Read-only browsing still works when browser storage is unavailable.
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <App />
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

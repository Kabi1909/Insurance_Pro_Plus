import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import { initializeDemoData } from './utils/demoData';
import { initializeAdminDemoData } from './utils/adminDemoData';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Offers from './pages/Offers';
import News from './pages/News';
import Reviews from './pages/Reviews';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import About from './pages/About';
import PublicClaims from './pages/PublicClaims';

// Auth Pages
import Dashboard from './pages/Dashboard';
import Policies from './pages/Policies';
import PolicyDetails from './pages/PolicyDetails';
import Claims from './pages/Claims';
import FileClaim from './pages/FileClaim';
import ClaimDetails from './pages/ClaimDetails';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClaims from './pages/admin/AdminClaims';
import AdminClaimDetails from './pages/admin/AdminClaimDetails';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCustomerDetails from './pages/admin/AdminCustomerDetails';
import AdminPolicies from './pages/admin/AdminPolicies';
import AdminPolicyDetails from './pages/admin/AdminPolicyDetails';
import AdminPayments from './pages/admin/AdminPayments';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';
import AdminStaff from './pages/admin/AdminStaff';
import AdminStaffDetails from './pages/admin/AdminStaffDetails';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminHelp from './pages/admin/AdminHelp';

function App() {
  useEffect(() => {
    initializeDemoData();
    initializeAdminDemoData();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/news" element={<News />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/public-claims" element={<PublicClaims />} />
      </Route>

      {/* Authenticated Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policies/:id" element={<PolicyDetails />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/claims/new" element={<FileClaim />} />
        <Route path="/claims/:id" element={<ClaimDetails />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/claims" element={<AdminClaims />} />
        <Route path="/admin/claims/:id" element={<AdminClaimDetails />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/customers/:id" element={<AdminCustomerDetails />} />
        <Route path="/admin/policies" element={<AdminPolicies />} />
        <Route path="/admin/policies/:id" element={<AdminPolicyDetails />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/documents" element={<AdminDocuments />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/staff/:id" element={<AdminStaffDetails />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/help" element={<AdminHelp />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

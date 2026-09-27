export const ADMIN_EMAIL = 'admin@insuranceproplus.com';
export const normalizeEmail = (email) => email.trim().toLowerCase();

// Local demo authentication only; production authentication requires a backend.
export const isAdminCredentials = (email, password) =>
  normalizeEmail(email) === ADMIN_EMAIL && password === 'Admin@123';

export const isCustomerCredentials = (email, password) =>
  normalizeEmail(email) === 'albert@demo.com' && password === 'Albert123';

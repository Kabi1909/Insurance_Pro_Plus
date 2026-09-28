import { api } from './api.js';
const paths = { ipp_policies: '/policies', ipp_claims: '/claims', ipp_payments: '/payments' };
export const readCollection = key => api(paths[key] || '/admin/' + key.replace('ipp_admin_', ''));

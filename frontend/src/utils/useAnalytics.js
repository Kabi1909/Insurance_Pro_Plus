import { useEffect, useState } from 'react';
import { api } from './api';
import { showToast } from './toast';
export function useAnalytics(days = 30, type = '') {
  const [data, setData] = useState({ customers:0, activePolicies:0, openClaims:0, premium:0, claimsPaid:0, expiring:0, claimsCount:0, newCustomers:0, approvalRate:0, revenueData:[], claimsData:[], policyDistribution:[], recentClaims:[], paymentStatus:[], customerGrowth:[], claimsByType:[] });
  useEffect(() => { let active=true; api(`/admin/analytics?days=${days}&type=${encodeURIComponent(type)}`).then(value=>{if(active)setData(value);}).catch(error=>{if(active)showToast(error.message,'error');}); return()=>{active=false;}; }, [days,type]);
  return data;
}

import { readCollection } from './storage';
export const getDemoUser = () => ({
  id: 'usr_albert_123',
  name: 'Albert',
  accountType: 'Business',
  businessName: 'Albert Enterprises',
  email: 'albert@demo.com',
  country: 'Sri Lanka',
  phone: '+94 77 123 4567'
});

export const initializeDemoData = () => {
  if (readCollection('ipp_policies', null) === null) {
    const policies = [
      {
        id: 'IPP-BP-2026-001',
        name: 'Business Property Insurance',
        type: 'Business',
        status: 'Active',
        coverage: '$250,000',
        premium: '$250/month',
        startDate: 'Jan 01, 2026',
        renewalDate: 'December 15, 2026',
        holder: 'Albert Enterprises',
        items: ['Office Building', 'Equipment', 'Inventory']
      },
      {
        id: 'IPP-BV-2026-002',
        name: 'Business Vehicle Insurance',
        type: 'Business',
        status: 'Active',
        coverage: '$100,000',
        premium: '$150/month',
        startDate: 'Feb 15, 2026',
        renewalDate: 'Feb 15, 2027',
        holder: 'Albert Enterprises',
        items: ['2 Delivery Vans', '1 Company Car']
      },
      {
        id: 'IPP-EP-2026-003',
        name: 'Employee Protection Plan',
        type: 'Business',
        status: 'Active',
        coverage: '$500,000',
        premium: '$300/month',
        startDate: 'Mar 01, 2026',
        renewalDate: 'Mar 01, 2027',
        holder: 'Albert Enterprises',
        items: ['Health Coverage', 'Workers Comp']
      }
    ];
    localStorage.setItem('ipp_policies', JSON.stringify(policies));
  }

  if (readCollection('ipp_claims', null) === null) {
    const claims = [
      {
        id: 'CLM-2026-0045',
        policyId: 'IPP-BP-2026-001',
        policyName: 'Business Property Insurance',
        incident: 'Property Damage',
        date: 'Oct 10, 2026',
        submittedDate: 'Oct 11, 2026',
        amount: '$5,000',
        status: 'Under Review',
        description: 'Water damage to office ceiling due to heavy rain.'
      }
    ];
    localStorage.setItem('ipp_claims', JSON.stringify(claims));
  }

  if (readCollection('ipp_payments', null) === null) {
    const payments = [
      { id: 'PAY-1001', policy: 'Business Property Insurance', date: 'Sep 15, 2026', amount: '$250', method: 'Credit Card', status: 'Completed' },
      { id: 'PAY-1002', policy: 'Business Vehicle Insurance', date: 'Sep 15, 2026', amount: '$150', method: 'Credit Card', status: 'Completed' },
      { id: 'PAY-1003', policy: 'Employee Protection Plan', date: 'Sep 01, 2026', amount: '$300', method: 'Bank Transfer', status: 'Completed' },
    ];
    localStorage.setItem('ipp_payments', JSON.stringify(payments));
  }
};

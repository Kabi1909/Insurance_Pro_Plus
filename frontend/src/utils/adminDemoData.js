export const initializeAdminDemoData = () => {
    // Generate realistic mock data for admin
    if (!localStorage.getItem('ipp_admin_claims')) {
        localStorage.setItem('ipp_admin_claims', JSON.stringify([
            { id: 'CLM-10482', customer: 'Nimal Perera', policy: 'POL-23892', type: 'Motor', amount: 325000, submittedDate: 'Sep 25, 2026', status: 'Under Review', officer: 'A. Fernando' },
            { id: 'CLM-10483', customer: 'Sunil Silva', policy: 'POL-19882', type: 'Health', amount: 45000, submittedDate: 'Sep 24, 2026', status: 'Additional Information Required', officer: 'M. Perera' },
            { id: 'CLM-10484', customer: 'Kamal Jayasinghe', policy: 'POL-44321', type: 'Life', amount: 1200000, submittedDate: 'Sep 20, 2026', status: 'Approved', officer: 'S. Bandara' },
            { id: 'CLM-10485', customer: 'Saman Kumara', policy: 'POL-11234', type: 'Home', amount: 850000, submittedDate: 'Sep 18, 2026', status: 'Paid', officer: 'A. Fernando' },
            { id: 'CLM-10486', customer: 'Ruwan Wijesinghe', policy: 'POL-88743', type: 'Business', amount: 200000, submittedDate: 'Sep 26, 2026', status: 'Submitted', officer: 'Unassigned' },
            { id: 'CLM-10487', customer: 'Kasun Rathnayake', policy: 'POL-22114', type: 'Motor', amount: 15000, submittedDate: 'Sep 22, 2026', status: 'Rejected', officer: 'M. Perera' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_customers')) {
        localStorage.setItem('ipp_admin_customers', JSON.stringify([
            { id: 'CUS-10291', name: 'Nimal Perera', type: 'Individual', email: 'nimal.p@example.com', policies: 2, totalPremium: 145000, status: 'Active', joined: 'Jan 15, 2024' },
            { id: 'CUS-10292', name: 'Sunil Silva', type: 'Individual', email: 'sunil.s@example.com', policies: 1, totalPremium: 45000, status: 'Active', joined: 'Mar 22, 2025' },
            { id: 'CUS-10293', name: 'TechSolutions Ltd', type: 'Business', email: 'info@techsolutions.lk', policies: 4, totalPremium: 850000, status: 'Active', joined: 'Jun 10, 2023' },
            { id: 'CUS-10294', name: 'Saman Kumara', type: 'Individual', email: 'saman.k@example.com', policies: 1, totalPremium: 35000, status: 'Pending Verification', joined: 'Sep 25, 2026' },
            { id: 'CUS-10295', name: 'Ruwan Wijesinghe', type: 'Individual', email: 'ruwan.w@example.com', policies: 3, totalPremium: 220000, status: 'Active', joined: 'Nov 05, 2022' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_policies')) {
        localStorage.setItem('ipp_admin_policies', JSON.stringify([
             { number: 'POL-23892', holder: 'Nimal Perera', type: 'Motor', coverage: 5000000, premium: 85000, startDate: 'Jan 15, 2026', expiryDate: 'Jan 14, 2027', paymentStatus: 'Paid', status: 'Active' },
             { number: 'POL-19882', holder: 'Sunil Silva', type: 'Health', coverage: 1000000, premium: 45000, startDate: 'Mar 22, 2026', expiryDate: 'Mar 21, 2027', paymentStatus: 'Paid', status: 'Active' },
             { number: 'POL-44321', holder: 'Kamal Jayasinghe', type: 'Life', coverage: 10000000, premium: 120000, startDate: 'Feb 10, 2020', expiryDate: 'Feb 09, 2040', paymentStatus: 'Pending', status: 'Active' },
             { number: 'POL-11234', holder: 'Saman Kumara', type: 'Home', coverage: 15000000, premium: 35000, startDate: 'Sep 25, 2025', expiryDate: 'Sep 24, 2026', paymentStatus: 'Paid', status: 'Expiring Soon' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_payments')) {
        localStorage.setItem('ipp_admin_payments', JSON.stringify([
            { id: 'TXN-88372', customer: 'Nimal Perera', policy: 'POL-23892', amount: 85000, method: 'Credit Card', date: 'Jan 10, 2026', status: 'Paid' },
            { id: 'TXN-88373', customer: 'Sunil Silva', policy: 'POL-19882', amount: 45000, method: 'Bank Transfer', date: 'Mar 15, 2026', status: 'Paid' },
            { id: 'TXN-88374', customer: 'TechSolutions Ltd', policy: 'POL-99211', amount: 150000, method: 'Corporate Cheque', date: 'Sep 24, 2026', status: 'Pending' },
            { id: 'TXN-88375', customer: 'Kamal Jayasinghe', policy: 'POL-44321', amount: 10000, method: 'Credit Card', date: 'Sep 20, 2026', status: 'Failed' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_documents')) {
        localStorage.setItem('ipp_admin_documents', JSON.stringify([
            { id: 'DOC-001', name: 'Accident_Photos.zip', type: 'Archive', size: '4.2 MB', customer: 'Nimal Perera', related: 'CLM-10482', uploadDate: 'Sep 25, 2026', uploadedBy: 'Customer', status: 'Verified', category: 'Claim Documents' },
            { id: 'DOC-002', name: 'Police_Report_Copy.pdf', type: 'PDF', size: '1.1 MB', customer: 'Nimal Perera', related: 'CLM-10482', uploadDate: 'Sep 25, 2026', uploadedBy: 'Customer', status: 'Pending Verification', category: 'Claim Documents' },
            { id: 'DOC-003', name: 'NIC_Front_Back.pdf', type: 'PDF', size: '2.4 MB', customer: 'Saman Kumara', related: 'CUS-10294', uploadDate: 'Sep 24, 2026', uploadedBy: 'Customer', status: 'Pending Verification', category: 'Identity Documents' },
            { id: 'DOC-004', name: 'Business_Reg.pdf', type: 'PDF', size: '5.1 MB', customer: 'TechSolutions Ltd', related: 'POL-99211', uploadDate: 'Jun 10, 2023', uploadedBy: 'A. Fernando', status: 'Verified', category: 'Business Documents' },
            { id: 'DOC-005', name: 'Medical_Report.pdf', type: 'PDF', size: '1.8 MB', customer: 'Sunil Silva', related: 'CLM-10483', uploadDate: 'Sep 24, 2026', uploadedBy: 'Customer', status: 'Rejected', category: 'Claim Documents' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_staff')) {
        localStorage.setItem('ipp_admin_staff', JSON.stringify([
            { id: 'STF-00124', name: 'Insurance Pro Plus Admin', email: 'admin@insuranceproplus.com', role: 'System Administrator', department: 'Administration', assignedClaims: 0, status: 'Active', joinedDate: 'Jan 01, 2020', lastActive: 'Just now' },
            { id: 'STF-00125', name: 'A. Fernando', email: 'a.fernando@insuranceproplus.com', role: 'Claims Officer', department: 'Claims', assignedClaims: 12, status: 'Active', joinedDate: 'Mar 15, 2021', lastActive: '2 hours ago' },
            { id: 'STF-00126', name: 'M. Perera', email: 'm.perera@insuranceproplus.com', role: 'Claims Officer', department: 'Claims', assignedClaims: 8, status: 'Active', joinedDate: 'Jul 22, 2022', lastActive: '1 day ago' },
            { id: 'STF-00127', name: 'S. Bandara', email: 's.bandara@insuranceproplus.com', role: 'Claims Manager', department: 'Claims', assignedClaims: 3, status: 'Active', joinedDate: 'Feb 10, 2019', lastActive: '5 hours ago' },
            { id: 'STF-00128', name: 'K. Silva', email: 'k.silva@insuranceproplus.com', role: 'Finance Officer', department: 'Finance', assignedClaims: 0, status: 'Inactive', joinedDate: 'Nov 05, 2023', lastActive: '2 months ago' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_audit')) {
        localStorage.setItem('ipp_admin_audit', JSON.stringify([
            { id: 'AUD-991', date: 'Sep 27, 2026 10:45 AM', staff: 'Insurance Pro Plus Admin', role: 'System Administrator', action: 'Approved Claim', resource: 'Claim', resourceId: 'CLM-10482', ip: '192.168.1.45', status: 'Success' },
            { id: 'AUD-992', date: 'Sep 27, 2026 09:30 AM', staff: 'A. Fernando', role: 'Claims Officer', action: 'Reviewed Claim', resource: 'Claim', resourceId: 'CLM-10483', ip: '192.168.1.112', status: 'Success' },
            { id: 'AUD-993', date: 'Sep 26, 2026 15:20 PM', staff: 'K. Silva', role: 'Finance Officer', action: 'Processed Payment', resource: 'Payment', resourceId: 'TXN-88372', ip: '192.168.1.88', status: 'Success' },
            { id: 'AUD-994', date: 'Sep 26, 2026 11:15 AM', staff: 'System', role: 'System', action: 'Failed Login', resource: 'Authentication', resourceId: 'admin@insuranceproplus.com', ip: '203.11.22.33', status: 'Warning' },
            { id: 'AUD-995', date: 'Sep 25, 2026 14:05 PM', staff: 'Insurance Pro Plus Admin', role: 'System Administrator', action: 'Created Staff', resource: 'Staff', resourceId: 'STF-00128', ip: '192.168.1.45', status: 'Success' },
        ]));
    }

    if (!localStorage.getItem('ipp_admin_notifications')) {
        localStorage.setItem('ipp_admin_notifications', JSON.stringify([
            { id: 'NOT-01', title: 'New claim submitted', description: 'New claim CLM-10482 has been submitted.', time: '5 min ago', category: 'Claims', read: false, resourceId: 'CLM-10482' },
            { id: 'NOT-02', title: 'Payment failed', description: 'Payment failed for policy POL-44219.', time: '20 min ago', category: 'Payments', read: false, resourceId: 'POL-44219' },
            { id: 'NOT-03', title: 'Policy expiring soon', description: 'Policy POL-23892 expires in 7 days.', time: '1 hour ago', category: 'Policies', read: true, resourceId: 'POL-23892' },
            { id: 'NOT-04', title: 'Document uploaded', description: 'Customer uploaded requested documents for CLM-10483.', time: '3 hours ago', category: 'Documents', read: true, resourceId: 'CLM-10483' },
            { id: 'NOT-05', title: 'Approval needed', description: 'Claim CLM-10484 is awaiting final approval.', time: '1 day ago', category: 'Claims', read: true, resourceId: 'CLM-10484' },
        ]));
    }
};
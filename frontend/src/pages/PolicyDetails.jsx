import { readCollection } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronRight, FileText, Download, ShieldAlert, CheckCircle } from 'lucide-react';

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isRenewing = searchParams.get('renew') === 'true';

  const [policy, setPolicy] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(isRenewing);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const storedPolicies = readCollection('ipp_policies');
    const foundPolicy = storedPolicies.find(p => p.id === id);
    if (foundPolicy) {
      setPolicy(foundPolicy);
    }
  }, [id]);

  const handleConfirmRenewal = () => {
    // Update local storage demo data
    const storedPolicies = readCollection('ipp_policies');
    const updatedPolicies = storedPolicies.map(p => {
      if (p.id === id) {
        // Simple renewal logic: add 1 year to renewal date
        return {
          ...p,
          renewalDate: 'December 15, 2027', // Static for demo based on Albert's requirement
          status: 'Active'
        };
      }
      return p;
    });
    localStorage.setItem('ipp_policies', JSON.stringify(updatedPolicies));
    setPolicy(updatedPolicies.find(p => p.id === id));
    
    // Also add a payment record
    const storedPayments = readCollection('ipp_payments');
    storedPayments.unshift({
      id: `PAY-${Date.now().toString().slice(-4)}`,
      policy: policy.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: '$2,850',
      method: 'Credit Card',
      status: 'Completed'
    });
    localStorage.setItem('ipp_payments', JSON.stringify(storedPayments));

    setShowReviewScreen(false);
    setShowSuccess(true);
  };

  const closeModals = () => {
    setShowRenewModal(false);
    setShowReviewScreen(false);
    setShowSuccess(false);
    // Remove query param
    navigate(`/policies/${id}`, { replace: true });
  };

  if (!policy) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-textSecondary" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li><Link to="/policies" className="hover:text-primary">My Policies</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="text-textMain font-medium" aria-current="page">Policy Details</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-textMain">{policy.name}</h1>
            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {policy.status}
            </span>
          </div>
          <p className="text-textSecondary">Policy Number: <span className="font-medium text-textMain">{policy.id}</span></p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-borderMain text-textMain px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Download Policy
          </button>
          <button 
            onClick={() => setShowRenewModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Renew Policy
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-textMain border-b border-borderMain pb-2">Policy Information</h2>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <span className="block text-sm text-textSecondary mb-1">Policy Holder</span>
              <span className="font-medium text-textMain">{policy.holder}</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Business Name</span>
              <span className="font-medium text-textMain">{policy.holder}</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Policy Type</span>
              <span className="font-medium text-textMain">{policy.type} Insurance</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Coverage Amount</span>
              <span className="font-medium text-textMain">{policy.coverage}</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Premium</span>
              <span className="font-medium text-textMain">{policy.premium}</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Current Status</span>
              <span className="font-medium text-textMain">{policy.status}</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Start Date</span>
              <span className="font-medium text-textMain">{policy.startDate}</span>
            </div>
            <div>
              <span className="block text-sm text-textSecondary mb-1">Renewal Date</span>
              <span className="font-medium text-textMain">{policy.renewalDate}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain border-b border-borderMain pb-2 mb-4">Covered Items</h2>
            <ul className="space-y-3">
              {policy.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-textMain">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain border-b border-borderMain pb-2 mb-4">Need Help?</h2>
            <p className="text-sm text-textSecondary mb-4">If you have questions about this policy or need to make changes, our support team is ready to help.</p>
            <div className="flex gap-3">
               <button className="flex-1 bg-white border border-borderMain text-textMain px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  Contact Support
               </button>
               <button className="flex-1 bg-red-50 text-error px-4 py-2 rounded-md font-medium hover:bg-red-100 transition-colors">
                  Cancel Policy
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Renewal Flow */}
      
      {/* Step 1: Init Renewal */}
      {showRenewModal && !showReviewScreen && !showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-textMain mb-4">Renew {policy.name}</h2>
            <p className="text-sm text-textSecondary mb-6">Review your renewal details below.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-borderMain space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-textSecondary text-sm">Current expiry:</span>
                <span className="font-medium text-textMain">{policy.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary text-sm">New expiry:</span>
                <span className="font-medium text-textMain">December 15, 2027</span>
              </div>
              <div className="pt-3 border-t border-borderMain flex justify-between">
                <span className="text-textMain font-medium">Renewal premium:</span>
                <span className="font-bold text-primary text-lg">$2,850</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={closeModals}
                className="px-4 py-2 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowReviewScreen(true)}
                className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Review Screen */}
      {showRenewModal && showReviewScreen && !showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-textMain mb-4">Review Your Renewal</h2>
            <div className="space-y-4 mb-6">
              <div className="border border-borderMain rounded-lg p-4">
                <h3 className="font-medium text-textMain mb-2">Policy Details</h3>
                <p className="text-sm text-textSecondary">{policy.name} ({policy.id})</p>
                <p className="text-sm text-textSecondary">Coverage: {policy.coverage}</p>
                <p className="text-sm text-textSecondary mt-2">New Period: Dec 15, 2026 - Dec 15, 2027</p>
              </div>
              <div className="border border-borderMain rounded-lg p-4">
                <h3 className="font-medium text-textMain mb-2">Payment Method</h3>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center text-primary font-bold text-xs">VISA</div>
                  <div>
                    <p className="text-sm font-medium text-textMain">•••• •••• •••• 4242</p>
                    <p className="text-xs text-textSecondary">Expires 12/28</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowReviewScreen(false)}
                className="px-4 py-2 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmRenewal}
                className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-textMain mb-2">Policy Renewed Successfully</h2>
            <p className="text-textSecondary mb-8">
              Your {policy.name} has been renewed until December 15, 2027.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={closeModals}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark"
              >
                View Policy
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-borderMain text-textMain rounded-md font-medium hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PolicyDetails;

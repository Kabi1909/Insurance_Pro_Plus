import { api, download } from '../utils/api';
import { showToast } from '../utils/toast';
import MissingRecord from '../components/MissingRecord';
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

  const [recordLoading,setRecordLoading]=useState(true);
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    if(isRenewing){navigate('/payments?policy='+encodeURIComponent(id),{replace:true});return;}
    let active = true;setRecordLoading(true);
    (async () => {
      try {

    const storedPolicies = await readCollection('ipp_policies');
    const foundPolicy = storedPolicies.find(p => p.id === id);
    if (active) setPolicy(foundPolicy || null);

      } catch (error) { if (active) showToast(error.message, 'error'); } finally { if(active)setRecordLoading(false); }
    })();
    return () => { active = false; };
  }, [id,isRenewing,navigate]);

  if(recordLoading)return <p className="p-6 text-slate-500">Loading record…</p>;
  if (!policy) return <MissingRecord label="Policy" backTo="/policies" />;

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
          <button onClick={() => download(`/policies/${id}/download`)} className="flex items-center gap-2 bg-white border border-borderMain text-textMain px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Download Policy
          </button>
          <button
            onClick={() => navigate("/payments?policy=" + encodeURIComponent(id))}
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
               <button onClick={() => navigate("/support")} className="flex-1 bg-white border border-borderMain text-textMain px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  Contact Support
               </button>
               <button onClick={async()=>{if(!window.confirm('Cancel this policy? Coverage will stop.'))return;try{await api('/policies/'+id+'/cancel',{method:'POST',body:{}});setPolicy({...policy,status:'Cancelled'});showToast('Policy cancelled.');}catch(e){showToast(e.message,'error');}}} disabled={policy.status==='Cancelled'} className="flex-1 bg-red-50 text-error px-4 py-2 rounded-md font-medium hover:bg-red-100 transition-colors">
                  Cancel Policy
               </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default PolicyDetails;

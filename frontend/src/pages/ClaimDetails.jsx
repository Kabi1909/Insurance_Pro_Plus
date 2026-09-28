import RecordDocuments from '../components/RecordDocuments';
import MessageThread from '../components/MessageThread';
import { showToast } from '../utils/toast';
import MissingRecord from '../components/MissingRecord';
import { readCollection } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, FileText, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';

const ClaimDetails = () => {
  const { id } = useParams();
  const [recordLoading,setRecordLoading]=useState(true);
  const [claim, setClaim] = useState(null);

  useEffect(() => {
    let active = true;setRecordLoading(true);
    (async () => {
      try {

    const storedClaims = await readCollection('ipp_claims');
    const foundClaim = storedClaims.find(c => c.id === id);
    if (active) setClaim(foundClaim || null);

      } catch (error) { if (active) showToast(error.message, 'error'); } finally { if(active)setRecordLoading(false); }
    })();
    return () => { active = false; };
  }, [id]);

  if(recordLoading)return <p className="p-6 text-slate-500">Loading record…</p>;
  if (!claim) return <MissingRecord label="Claim" backTo="/claims" />;

  const getStatusIcon = (status) => {
    if (status === 'Completed' || status === 'Approved') return <CheckCircle className="h-5 w-5 text-success" />;
    return <Clock className="h-5 w-5 text-accent" />;
  };

  const getTimelineStatus = stepName => {if(stepName==='Claim Submitted')return claim.status==='Submitted'?'active':'completed';if(stepName===claim.status)return 'active';if(stepName==='Decision')return ['Approved','Rejected','Paid'].includes(claim.status)?'completed':'pending';return claim.status==='Paid'?'completed':'pending';};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <nav className="flex text-sm text-textSecondary" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li><Link to="/claims" className="hover:text-primary">Claims</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="text-textMain font-medium">Claim Details</li>
        </ol>
      </nav>

      <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-textMain mb-1">Claim {claim.id}</h1>
          <p className="text-textSecondary">{claim.policyName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium text-sm flex items-center gap-1.5">
            {getStatusIcon(claim.status)} {claim.status}
          </span>
          <p className="text-xs text-textSecondary mt-2">Submitted on {claim.submittedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-4">Claim Information</h2>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="block text-sm text-textSecondary mb-1">Incident Type</span>
                <span className="font-medium text-textMain">{claim.incident}</span>
              </div>
              <div>
                <span className="block text-sm text-textSecondary mb-1">Incident Date</span>
                <span className="font-medium text-textMain">{claim.date}</span>
              </div>
              <div>
                <span className="block text-sm text-textSecondary mb-1">Claim Amount</span>
                <span className="font-medium text-textMain text-lg text-primary">{claim.amount}</span>
              </div>
              <div>
                 <span className="block text-sm text-textSecondary mb-1">Related Policy</span>
                <Link to={`/policies/${claim.policyId}`} className="font-medium text-primary hover:underline">{claim.policyId}</Link>
              </div>
              <div className="col-span-2">
                <span className="block text-sm text-textSecondary mb-1">Description</span>
                <p className="text-textMain text-sm bg-gray-50 p-4 rounded-lg border border-borderMain leading-relaxed">{claim.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
             <h2 className="text-lg font-bold text-textMain mb-4">Uploaded Documents</h2>
             <RecordDocuments related={claim.id} />
          </div>
        </div>

        <div className="space-y-6"><div className="bg-white p-6 rounded-xl border border-borderMain"><h2 className="text-lg font-bold mb-4">Messages</h2><MessageThread kind="claims" record={claim} onUpdate={setClaim}/></div>
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-6">Status Timeline</h2>
            <div className="relative pl-6 space-y-8">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>

              {[
                { name: 'Claim Submitted', desc: 'We received your claim details.', time: claim.submittedDate },

                { name: claim.status, desc: 'Current claim status', time: '' },
                { name: 'Decision', desc: ['Approved','Rejected','Paid'].includes(claim.status)?claim.status:'Pending adjuster decision.', time: '' },
                { name: 'Payment', desc: claim.status==='Paid'?'Payment recorded.':claim.status==='Rejected'?'Not applicable.':'Pending approval and settlement.', time: '' }
              ].map((step, idx) => {
                const status = getTimelineStatus(step.name);
                return (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-9 h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                      status === 'completed' ? 'bg-success' :
                      status === 'active' ? 'bg-primary' : 'bg-gray-200'
                    }`}>
                      {status === 'completed' ? <CheckCircle className="h-4 w-4 text-white" /> :
                       status === 'active' ? <div className="h-2 w-2 bg-white rounded-full"></div> : null}
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm ${status === 'pending' ? 'text-gray-400' : 'text-textMain'}`}>{step.name}</h4>
                      <p className={`text-xs mt-0.5 ${status === 'pending' ? 'text-gray-400' : 'text-textSecondary'}`}>{step.desc}</p>
                      {step.time && <p className="text-[10px] text-primary mt-1 font-medium">{step.time}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center">
            <AlertCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-textMain mb-2">Need help with this claim?</h3>
            <p className="text-sm text-textSecondary mb-4">Chat with our support team to get real-time updates.</p>
            <button
              onClick={() => document.querySelector('.fixed.bottom-6.right-6')?.click()}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;

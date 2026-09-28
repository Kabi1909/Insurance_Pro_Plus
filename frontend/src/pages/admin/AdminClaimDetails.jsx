import MessageThread from '../../components/MessageThread';
import { api, money } from '../../utils/api';
import RecordDocuments from '../../components/RecordDocuments';
import MissingRecord from '../../components/MissingRecord';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, XCircle, FileText, User, Shield, Paperclip, Clock, MessageSquare, Briefcase, Plus } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/admin/Modal';
import { showToast } from '../../utils/toast';
import { AdminAuthContext } from '../../context/AdminAuthContext';

const AdminClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useContext(AdminAuthContext);

  const [recordLoading,setRecordLoading]=useState(true);
  const [claim, setClaim] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject'

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');

  const [notes, setNotes] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    let active = true;setRecordLoading(true);
    (async () => {
      try {

    const claims = await readCollection('ipp_admin_claims');
    const found = claims.find(c => c.id === id);
    if (active) { setClaim(found || null); setNotes(found?.notes || []); }
    const staff = await api("/admin/staff");
    if (active) setOfficers(staff.filter(s => s.status === "Active"));

      } catch (error) { if (active) showToast(error.message, 'error'); } finally { if(active)setRecordLoading(false); }
    })();
    return () => { active = false; };
  }, [id]);

  if(recordLoading)return <p className="p-6 text-slate-500">Loading record…</p>;
  if (!claim) return <MissingRecord label="Claim" backTo="/admin/claims" />;

  const handleAction = (type) => {
    setActionType(type);
    setShowConfirm(true);
  };

  const updateClaim = async fields => {
    const updated = await api('/admin/claims/'+id, {method:'PATCH', body:fields});
    setClaim(updated); setNotes(updated.notes || []); return updated;
  };
  const confirmAction = async () => { try { await updateClaim({status:actionType==='approve'?'Approved':'Rejected'});setShowConfirm(false);showToast('Claim decision saved.'); } catch(error){showToast(error.message,'error');} };
  const handleAssign = async e => { e.preventDefault();try{await updateClaim({officerId:selectedOfficer});setShowAssignModal(false);showToast('Officer assigned.');}catch(error){showToast(error.message,'error');} };
  const handleRequestInfo = async e => {e.preventDefault();const message=new FormData(e.currentTarget).get('message');try{await updateClaim({status:'Additional Information Required',message});setShowRequestModal(false);showToast('Information request saved for the customer.');}catch(error){showToast(error.message,'error');}};
  const handleAddNote = async () => {if(!newNote.trim())return;try{await updateClaim({note:newNote});setNewNote('');showToast('Internal note saved.');}catch(error){showToast(error.message,'error');}};

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-2 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Claims
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Claim #{claim.id}</h1>
            <StatusBadge status={claim.status} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button onClick={() => setShowAssignModal(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Assign Officer
           </button>
           <button onClick={() => setShowRequestModal(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Request Info
           </button>
           <button
             onClick={() => handleAction('approve')}
             disabled={['Approved', 'Rejected', 'Paid'].includes(claim.status)}
             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
           >
             Approve Claim
           </button>
           <button
             onClick={() => handleAction('reject')}
             disabled={['Approved', 'Rejected', 'Paid'].includes(claim.status)}
             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
           >
             Reject Claim
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> Claim Details</h2>
             <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Claim Amount</p>
                  <p className="text-2xl font-bold text-slate-900">{money(claim.amount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Incident Date</p>
                  <p className="text-slate-900 font-medium">{claim.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-slate-500 mb-1">Description of Incident</p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {claim.description}
                  </p>
                </div>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
               <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><User className="h-5 w-5 text-blue-600" /> Customer Information</h2>
               <div className="space-y-3">
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Name</span><span className="font-medium text-slate-900">{claim.customer}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Customer ID</span><span className="font-medium text-blue-600">{claim.owner}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Phone</span><span className="font-medium text-slate-900">{claim.phone || "Not provided"}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Email</span><span className="font-medium text-slate-900">{claim.email || "Not provided"}</span></div>
               </div>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
               <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-blue-600" /> Policy Information</h2>
               <div className="space-y-3">
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Policy Number</span><span className="font-medium text-blue-600">{claim.policy}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Type</span><span className="font-medium text-slate-900">{claim.type} Insurance</span></div>
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Coverage</span><span className="font-medium text-slate-900">{money(claim.coverage)}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500 text-sm">Status</span><span className="font-medium text-green-600">{claim.policyStatus}</span></div>
               </div>
             </div>
           </div>

           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
             <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Paperclip className="h-5 w-5 text-blue-600" /> Supporting Documents</h2>
             <RecordDocuments related={id} admin /><h3 className="font-bold mt-6 mb-3">Customer messages</h3><MessageThread kind="claims" record={claim} onUpdate={setClaim}/>
           </div>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-blue-600" /> Claim Timeline</h2>
            <div className="space-y-4">
              <div className="relative pl-6 border-l-2 border-blue-200 pb-4">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                <p className="text-sm font-bold text-slate-900">Claim Submitted</p>
                <p className="text-xs text-slate-500">{claim.submittedDate}</p>
              </div>
              <div className="relative pl-6 border-l-2 border-slate-200 pb-4">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white"></div>
                <p className="text-sm font-bold text-slate-900">Assigned to Officer</p>
                <p className="text-xs text-slate-500">{claim.officer !== 'Unassigned' ? claim.officer : 'Pending'}</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white"></div>
                <p className="text-sm font-bold text-slate-900">Final Decision</p>
                <p className="text-xs text-slate-500">{['Approved', 'Rejected', 'Paid'].includes(claim.status) ? claim.status : 'Pending Review'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-blue-600" /> Internal Notes</span>
              <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Internal Only</span>
            </h2>
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-2">
              {notes.map(n => (
                <div key={n.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-700">{n.author}</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-sm text-slate-600">{n.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
               <textarea
                 className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 resize-none"
                 placeholder="Type a note here..."
                 rows="3"
                 value={newNote}
                 onChange={(e) => setNewNote(e.target.value)}
               ></textarea>
               <button onClick={handleAddNote} className="w-full mt-2 bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                 Add Note
               </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title={actionType === 'approve' ? "Approve Claim?" : "Reject Claim?"}
        message={actionType === 'approve' ? "Are you sure you want to approve this claim? Financial processing will be initiated." : "Are you sure you want to reject this claim? The customer will be notified."}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
        confirmText={actionType === 'approve' ? "Approve" : "Reject"}
        type={actionType === 'approve' ? "success" : "danger"}
      />

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Claims Officer">
        <form onSubmit={handleAssign} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Select Officer</label>
             <select required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white" value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}>
               <option value="" disabled>Select an officer...</option>
               {officers.map(officer => <option key={officer.id} value={officer.id}>{officer.name}</option>)}
             </select>
           </div>
           <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Assign Claim</button>
           </div>
        </form>
      </Modal>

      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Information">
        <form onSubmit={handleRequestInfo} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Request Type</label>
             <select className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white">
               <option>Additional Photos</option>
               <option>Police Report</option>
               <option>Medical Document</option>
               <option>Invoice/Receipt</option>
               <option>Identity Verification</option>
               <option>Other</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Message to Customer</label>
             <textarea name="message" required rows="4" className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500 resize-none" placeholder="Please provide clear photos of the incident..."></textarea>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
             <input type="date" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
           </div>
           <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Send Request</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminClaimDetails;

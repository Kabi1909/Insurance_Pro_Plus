import { api, download } from '../../utils/api';
import RelatedRecords from '../../components/RelatedRecords';
import RecordEditor from '../../components/RecordEditor';
import MissingRecord from '../../components/MissingRecord';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Phone, Briefcase, Building, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Modal from '../../components/admin/Modal';
import { showToast } from '../../utils/toast';

const AdminStaffDetails = () => {
  const [editor, setEditor] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [recordLoading,setRecordLoading]=useState(true);
  const [staff, setStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [showSuspend, setShowSuspend] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    let active = true;setRecordLoading(true);
    (async () => {
      try {

    const data = await readCollection('ipp_admin_staff');
    const found = data.find(s => s.id === id);
    if (active) setStaff(found || null);

      } catch (error) { if (active) showToast(error.message, 'error'); } finally { if(active)setRecordLoading(false); }
    })();
    return () => { active = false; };
  }, [id]);

  if(recordLoading)return <p className="p-6 text-slate-500">Loading record…</p>;
  if (!staff) return <MissingRecord label="Staff" backTo="/admin/staff" />;

  const handleSuspend = async () => {try{await api('/admin/staff/'+id,{method:'PATCH',body:{status:staff.status==='Active'?'Suspended':'Active'}});setStaff(await api('/admin/staff/'+id));setShowSuspend(false);showToast('Account updated.');}catch(error){showToast(error.message,'error');}};
  const handleEdit = async e => {e.preventDefault();try{await api('/admin/staff/'+id,{method:'PATCH',body:Object.fromEntries(new FormData(e.currentTarget))});setStaff(await api('/admin/staff/'+id));setShowEdit(false);showToast('Staff updated.');}catch(error){showToast(error.message,'error');}};
  const tabs = ['Overview', 'Assigned Work', 'Activity', 'Permissions'];

  return (
    <div className="space-y-6">
      {editor && <RecordEditor {...editor} onClose={()=>setEditor(null)} onSaved={async()=>setStaff(await api('/admin/staff/'+id))} />}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <button onClick={() => navigate('/admin/staff')} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-2 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Staff Management
          </button>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0 shadow-inner">
               {staff.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
            </div>
            <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                 {staff.name}
                 <StatusBadge status={staff.status} />
               </h1>
               <p className="text-slate-500">{staff.role} • {staff.department}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <button onClick={() => setShowEdit(true)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Edit Staff
           </button>
           <button onClick={()=>setEditor({title:'Change Staff Role',path:'/admin/staff/'+id,initial:staff,fields:[{name:'role',label:'Role',options:['System Administrator','Claims Officer','Claims Manager','Finance Officer','Support Officer']}]})} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
             Change Role
           </button>
           <button onClick={()=>setEditor({title:'Reset Password',path:'/admin/staff/'+id+'/password',method:'POST',fields:[{name:'password',label:'Temporary Password',type:'password'}]})} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">Reset Password</button>
           <button
             onClick={() => setShowSuspend(true)}
             className={`px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium shadow-sm ${staff.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
           >
             {staff.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto hide-scrollbar px-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-5 w-5 text-blue-600" /> Employee Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Employee ID</span>
                    <span className="text-sm font-bold text-slate-900">{staff.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Full Name</span>
                    <span className="text-sm font-semibold text-slate-900">{staff.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Email</span>
                    <span className="text-sm font-medium text-blue-600">{staff.email}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-sm font-medium text-slate-500">Phone</span>
                    <span className="text-sm font-medium text-slate-900">{staff.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldAlert className="h-5 w-5 text-blue-600" /> Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Status</span>
                    <StatusBadge status={staff.status} />
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Joined Date</span>
                    <span className="text-sm font-semibold text-slate-900">{staff.joinedDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-sm font-medium text-slate-500">Last Login</span>
                    <span className="text-sm font-medium text-slate-900">{staff.lastActive}</span>
                  </div>
                </div>
              </div>

              {staff.role.includes('Claims') && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Briefcase className="h-5 w-5 text-blue-600" /> Claims Workload
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                       <p className="text-slate-500 text-sm mb-1">Assigned Claims</p>
                       <p className="text-2xl font-bold text-slate-900">{staff.assignedClaims}</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                       <p className="text-slate-500 text-sm mb-1">Pending Reviews</p>
                       <p className="text-2xl font-bold text-slate-900">{staff.pendingReviews||0}</p>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                       <p className="text-slate-500 text-sm mb-1">Completed (This Month)</p>
                       <p className="text-2xl font-bold text-slate-900">{staff.completedThisMonth||0}</p>
                     </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="py-12 text-center text-slate-500">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Clock className="h-8 w-8 text-slate-400" />
               </div>
               <RelatedRecords tab={activeTab} record={staff} entity="staff" />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showSuspend}
        title={staff.status === 'Active' ? "Suspend Staff Account?" : "Activate Staff Account?"}
        message={staff.status === 'Active'
          ? `Are you sure you want to suspend ${staff.name}? They will immediately lose access to the administration portal.`
          : `Are you sure you want to reactivate ${staff.name}'s account?`}
        onConfirm={handleSuspend}
        onCancel={() => setShowSuspend(false)}
        confirmText={staff.status === 'Active' ? "Suspend Account" : "Activate Account"}
        type={staff.status === 'Active' ? "danger" : "success"}
      />

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Staff Profile">
         <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required defaultValue={staff.name} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <input type="email" readOnly defaultValue={staff.email} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="text" name="phone" defaultValue={staff.phone||''} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-blue-500" />
            </div>
            <div className="pt-4 flex justify-end gap-3">
               <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
               <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Save Changes</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default AdminStaffDetails;

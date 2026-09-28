import RecordFilter from '../../components/admin/RecordFilter';
import { download, money } from '../../utils/api';
import { api } from '../../utils/api';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { Search, Filter, Users, UserPlus, MoreVertical, ShieldAlert } from 'lucide-react';
import { showToast } from '../../utils/toast';

const AdminStaff = () => {
  const [statusFilter,setStatusFilter]=useState('');
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ firstName: '', lastName: '', email: '', phone: '', empId: '', department: 'Claims', role: 'Claims Officer' });

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const data = await readCollection('ipp_admin_staff');
    if (active) setStaffList(data);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Employee ID', accessor: 'id', className: 'font-medium text-slate-900' },
    { header: 'Employee', accessor: 'name', render: (row) => (
       <div className="flex items-center gap-3">
         <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
           {row.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
         </div>
         <div>
           <p className="font-semibold text-slate-900">{row.name}</p>
         </div>
       </div>
    )},
    { header: 'Email', accessor: 'email', render: (row) => <span className="text-blue-600">{row.email}</span> },
    { header: 'Role', accessor: 'role' },
    { header: 'Department', accessor: 'department' },
    { header: 'Assigned Claims', accessor: 'assignedClaims', render: (row) => row.assignedClaims > 0 ? <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">{row.assignedClaims} Claims</span> : <span className="text-slate-400">-</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Last Active', accessor: 'lastActive', className: 'text-slate-500 text-xs' },
    {
      header: 'Actions',
      render: (row) => (
        <button onClick={(e) => { e.stopPropagation(); navigate(`/admin/staff/${row.id}`); }} className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
          Manage
        </button>
      )
    },
  ];

  const handleAddStaff = async e => {
    e.preventDefault();try { await api('/admin/staff',{method:'POST',body:{...newStaff,name:newStaff.firstName+' '+newStaff.lastName,password:new FormData(e.currentTarget).get('password'),mustChangePassword:new FormData(e.currentTarget).get('mustChangePassword')==='on'}});setStaffList(await api('/admin/staff'));setShowAddModal(false);showToast('Staff account created.'); } catch(error){showToast(error.message,'error');}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Staff Management</h1>
          <p className="text-slate-500">Manage Insurance Pro Plus employees and administration access.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
          <UserPlus className="h-4 w-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={staffList.length} icon={Users} color="blue" />
        <StatCard title="Active Staff" value={staffList.filter(s => s.status === 'Active').length} color="green" />
        <StatCard title="Claims Officers" value={staffList.filter(s => s.role === 'Claims Officer').length} color="slate" />
        <StatCard title="Administrators" value={staffList.filter(s => s.role === 'System Administrator').length} icon={ShieldAlert} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name, ID or email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <RecordFilter data={staffList} value={statusFilter} onChange={setStatusFilter}/>
          </div>
        </div>

        <DataTable columns={columns} data={filteredStaff.filter(r=>!statusFilter||r.status===statusFilter)} onRowClick={(row) => navigate(`/admin/staff/${row.id}`)} />
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Staff Member" maxWidth="max-w-2xl">
        <form onSubmit={handleAddStaff} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">First Name *</label>
              <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newStaff.firstName} onChange={(e) => setNewStaff({...newStaff, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name *</label>
              <input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newStaff.lastName} onChange={(e) => setNewStaff({...newStaff, lastName: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Work Email *</label>
              <input required type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newStaff.phone} onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Employee ID *</label>
              <input required type="text" placeholder="e.g. STF-1029" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={newStaff.empId} onChange={(e) => setNewStaff({...newStaff, empId: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Department *</label>
              <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={newStaff.department} onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}>
                <option>Administration</option>
                <option>Claims</option>
                <option>Policy Management</option>
                <option>Finance</option>
                <option>Customer Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Role *</label>
              <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}>
                <option>System Administrator</option>
                <option>Claims Manager</option>
                <option>Claims Officer</option>
                <option>Policy Officer</option>
                <option>Finance Officer</option>
                <option>Support Officer</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100">
             <label className="block text-sm font-semibold text-slate-700 mb-1">Temporary Password *</label>
             <input required name="password" type="password" minLength={8} className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
             <label className="flex items-center gap-2">
               <input name="mustChangePassword" type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
               <span className="text-sm text-slate-600">Require password change on first login</span>
             </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Create Staff Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStaff;

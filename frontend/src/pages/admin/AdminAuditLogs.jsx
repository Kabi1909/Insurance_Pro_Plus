import { paymentText } from '../../utils/paymentText';
import RecordFilter from '../../components/admin/RecordFilter';
import { download, money } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DataTable from '../../components/admin/DataTable';
import { Search, Filter, ShieldCheck, UserCheck, AlertTriangle, XCircle, Download } from 'lucide-react';

const AdminAuditLogs = () => {
  const [statusFilter,setStatusFilter]=useState('');
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const data = await readCollection('ipp_admin_audit');
    if (active) setLogs(data);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const filteredLogs = logs.filter(l =>
    l.staff.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.resourceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Date & Time', accessor: 'date', className: 'text-slate-500 whitespace-nowrap' },
    { header: 'Staff Member', accessor: 'staff', className: 'font-medium text-slate-900' },
    { header: 'Role', accessor: 'role', className: 'text-slate-500' },
    { header: 'Action', accessor: 'action', render: (row) => <span className="font-semibold text-slate-700">{paymentText(row.action)}</span> },
    { header: 'Resource', accessor: 'resource' },
    { header: 'Resource ID', accessor: 'resourceId', render: (row) => <span className="font-medium text-blue-600">{row.resourceId}</span> },
    { header: 'IP Address', accessor: 'ip', className: 'font-mono text-xs text-slate-500' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${row.status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : row.status === 'Warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
        {row.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Audit Logs</h1>
          <p className="text-slate-500">Review administrative and system activities across Insurance Pro Plus.</p>
        </div>
        <button onClick={()=>download('/admin/export?kind=audit')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"><Download className="h-4 w-4" />Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Activities Today" value={logs.filter(l=>l.date?.startsWith(new Date().toISOString().slice(0,10))).length} icon={ShieldCheck} color="blue" />
        <StatCard title="Staff Logins" value={logs.filter(l=>l.action==='Signed in'&&l.role!=='Customer').length} icon={UserCheck} color="green" />
        <StatCard title="Security Events" value={logs.filter(l=>/password|suspend/i.test(l.action)).length} icon={AlertTriangle} color="yellow" />
        <StatCard title="Failed Actions" value={logs.filter(l=>l.status==='Failed').length} icon={XCircle} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50 rounded-t-xl">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by staff, action, or resource ID..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <RecordFilter data={logs} value={statusFilter} onChange={setStatusFilter}/>
          </div>
        </div>

        {/* Important: Audit logs do not have Edit/Delete actions per requirements */}
        <DataTable columns={columns} data={filteredLogs.filter(r=>!statusFilter||r.status===statusFilter)} />

        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex items-center justify-between text-sm text-slate-500">
           <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-green-600" /> Logs are immutable and securely stored.</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;

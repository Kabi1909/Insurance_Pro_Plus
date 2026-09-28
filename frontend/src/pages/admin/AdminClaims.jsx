import RecordFilter from '../../components/admin/RecordFilter';
import { download, money } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DataTable from '../../components/admin/DataTable';
import { Search, Filter, AlertCircle, FileText, CheckCircle, XCircle, DollarSign, Download } from 'lucide-react';

const AdminClaims = () => {
  const [statusFilter,setStatusFilter]=useState('');
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const data = await readCollection('ipp_admin_claims');
    if (active) setClaims(data);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const filteredClaims = claims.filter(c =>
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Claim ID', accessor: 'id', className: 'font-medium text-slate-900' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Policy', accessor: 'policy', render: (row) => <span className="text-slate-500">{row.policy}</span> },
    { header: 'Type', accessor: 'type' },
    { header: 'Amount', accessor: 'amount', render: (row) => `USD ${row.amount.toLocaleString()}` },
    { header: 'Date', accessor: 'submittedDate' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Officer', accessor: 'officer' },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/admin/claims/${row.id}`); }}
          className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
        >
          View Details
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Claims Management</h1>
        <p className="text-slate-500">Review, process and track insurance claims.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Claims" value={claims.length} color="blue" />
        <StatCard title="Pending Review" value={claims.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length} color="yellow" />
        <StatCard title="Approved" value={claims.filter(c => c.status === 'Approved').length} color="green" />
        <StatCard title="Rejected" value={claims.filter(c => c.status === 'Rejected').length} color="red" />
        <StatCard title="Paid" value={claims.filter(c => c.status === 'Paid').length} color="slate" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by claim ID, customer or policy..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <RecordFilter data={claims} value={statusFilter} onChange={setStatusFilter}/>
             <button onClick={()=>download('/admin/export?kind=claims')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"><Download className="h-4 w-4 text-slate-500" />Export
             </button>
          </div>
        </div>

        <DataTable columns={columns} data={filteredClaims.filter(r=>!statusFilter||r.status===statusFilter)} onRowClick={(row) => navigate(`/admin/claims/${row.id}`)} />

        {/* Simple Pagination Mock */}
      </div>
    </div>
  );
};

export default AdminClaims;

import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DataTable from '../../components/admin/DataTable';
import { Search, Filter, FileText } from 'lucide-react';

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = readCollection('ipp_admin_policies');
    setPolicies(data);
  }, []);

  const filteredPolicies = policies.filter(p => 
    p.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.holder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Policy No.', accessor: 'number', className: 'font-medium text-slate-900' },
    { header: 'Holder', accessor: 'holder' },
    { header: 'Type', accessor: 'type' },
    { header: 'Coverage', accessor: 'coverage', render: (row) => `LKR ${row.coverage.toLocaleString()}` },
    { header: 'Premium', accessor: 'premium', render: (row) => `LKR ${row.premium.toLocaleString()}` },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'Expiry Date', accessor: 'expiryDate' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { 
      header: 'Actions', 
      render: (row) => (
        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
          View Policy
        </button>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Policy Management</h1>
        <p className="text-slate-500">Manage all active and inactive insurance policies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Policies" value={policies.length} icon={FileText} color="blue" />
        <StatCard title="Active" value={policies.filter(p => p.status === 'Active').length} color="green" />
        <StatCard title="Pending" value={0} color="yellow" />
        <StatCard title="Expiring Soon" value={policies.filter(p => p.status === 'Expiring Soon').length} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search policy number, holder..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
               <Filter className="h-4 w-4 text-slate-500" />
               Filters
             </button>
          </div>
        </div>
        
        <DataTable columns={columns} data={filteredPolicies} />
      </div>
    </div>
  );
};

export default AdminPolicies;

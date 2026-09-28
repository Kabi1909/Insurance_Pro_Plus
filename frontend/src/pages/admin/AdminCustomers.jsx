import RecordFilter from '../../components/admin/RecordFilter';
import { download, money } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DataTable from '../../components/admin/DataTable';
import { Search, Filter, Users, Building, Download } from 'lucide-react';

const AdminCustomers = () => {
  const [statusFilter,setStatusFilter]=useState('');
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const data = await readCollection('ipp_admin_customers');
    if (active) setCustomers(data);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Customer ID', accessor: 'id', className: 'font-medium text-slate-900' },
    { header: 'Customer Name', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    { header: 'Email', accessor: 'email' },
    { header: 'Policies', accessor: 'policies' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Joined', accessor: 'joined' },
    {
      header: 'Actions',
      render: (row) => (
        <button onClick={() => navigate(`/admin/customers/${row.id}`)} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
          View Profile
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Customer Management</h1>
        <p className="text-slate-500">View and manage individual and business policy holders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Customers" value={customers.length} icon={Users} color="blue" />
        <StatCard title="Individuals" value={customers.filter(c => c.type === 'Individual').length} icon={Users} color="slate" />
        <StatCard title="Businesses" value={customers.filter(c => c.type === 'Business').length} icon={Building} color="slate" />
        <StatCard title="New This Month" value={customers.filter(c=>c.createdAt?.startsWith(new Date().toISOString().slice(0,7))).length} color="green" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email, customer ID..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <RecordFilter data={customers} value={statusFilter} onChange={setStatusFilter}/>
          </div>
        </div>

        <DataTable columns={columns} data={filteredCustomers.filter(r=>!statusFilter||r.status===statusFilter)} />
      </div>
    </div>
  );
};

export default AdminCustomers;

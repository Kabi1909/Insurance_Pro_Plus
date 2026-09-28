import { paymentText } from '../../utils/paymentText';
import RecordFilter from '../../components/admin/RecordFilter';
import { download, money } from '../../utils/api';
import { showToast } from '../../utils/toast';
import { readCollection } from '../../utils/storage';
import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DataTable from '../../components/admin/DataTable';
import { Search, Filter, CreditCard, DollarSign } from 'lucide-react';

const AdminPayments = () => {
  const [statusFilter,setStatusFilter]=useState('');
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const data = await readCollection('ipp_admin_payments');
    if (active) setPayments(data);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const filteredPayments = payments.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Transaction ID', accessor: 'id', className: 'font-medium text-slate-900' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Policy No.', accessor: 'policy' },
    { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-semibold text-blue-700">USD {row.amount.toLocaleString()}</span> },
    { header: 'Method', accessor: 'method', render: (row) => paymentText(row.method) },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payments & Revenue</h1>
        <p className="text-slate-500">Track premium payments and financial transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Collected" value={money(payments.filter(p=>p.status==='Paid').reduce((sum,p)=>sum+p.amount,0))} icon={DollarSign} color="blue" />
        <StatCard title="Successful Payments" value={payments.filter(p => p.status === 'Paid').length} icon={CreditCard} color="green" />
        <StatCard title="Pending Payments" value={payments.filter(p => p.status === 'Pending').length} color="yellow" />
        <StatCard title="Failed/Overdue" value={payments.filter(p => p.status === 'Failed').length} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transaction ID, customer..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <RecordFilter data={payments} value={statusFilter} onChange={setStatusFilter}/>
          </div>
        </div>

        <DataTable columns={columns} data={filteredPayments.filter(r=>!statusFilter||r.status===statusFilter)} />
      </div>
    </div>
  );
};

export default AdminPayments;

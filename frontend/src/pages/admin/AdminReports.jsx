import React from 'react';
import { CheckCircle, Calendar, Download, DollarSign, AlertCircle, FileText, Users, Activity } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line } from 'recharts';
import { showToast } from '../../utils/toast';

const revenueData = [
  { name: 'Jan', revenue: 18.2 }, { name: 'Feb', revenue: 19.5 }, { name: 'Mar', revenue: 21.0 },
  { name: 'Apr', revenue: 20.2 }, { name: 'May', revenue: 22.5 }, { name: 'Jun', revenue: 23.1 },
  { name: 'Jul', revenue: 22.8 }, { name: 'Aug', revenue: 24.2 }, { name: 'Sep', revenue: 24.8 },
];

const claimsData = [
  { name: 'Jan', submitted: 120, approved: 95, rejected: 15 },
  { name: 'Feb', submitted: 132, approved: 105, rejected: 18 },
  { name: 'Mar', submitted: 145, approved: 110, rejected: 25 },
  { name: 'Apr', submitted: 125, approved: 98, rejected: 20 },
  { name: 'May', submitted: 150, approved: 120, rejected: 22 },
  { name: 'Jun', submitted: 165, approved: 135, rejected: 20 },
];

const policyDistribution = [
  { name: 'Motor', value: 38, color: '#2563EB' }, { name: 'Health', value: 26, color: '#0F766E' },
  { name: 'Life', value: 18, color: '#F59E0B' }, { name: 'Home', value: 11, color: '#8B5CF6' },
  { name: 'Business', value: 7, color: '#64748B' },
];

const paymentStatus = [
  { name: 'Paid', value: 82, color: '#16A34A' },
  { name: 'Pending', value: 12, color: '#F59E0B' },
  { name: 'Failed', value: 4, color: '#DC2626' },
  { name: 'Overdue', value: 2, color: '#64748B' },
];

const customerGrowth = [
  { name: 'Jan', newCustomers: 120 }, { name: 'Feb', newCustomers: 145 }, { name: 'Mar', newCustomers: 210 },
  { name: 'Apr', newCustomers: 180 }, { name: 'May', newCustomers: 250 }, { name: 'Jun', newCustomers: 310 },
  { name: 'Jul', newCustomers: 290 }, { name: 'Aug', newCustomers: 380 }, { name: 'Sep', newCustomers: 428 },
];

const claimsByType = [
  { name: 'Motor', amount: 154 }, { name: 'Health', amount: 120 }, { name: 'Life', amount: 45 },
  { name: 'Home', amount: 32 }, { name: 'Business', amount: 35 },
];

const AdminReports = () => {

  const handleExport = (type) => {
    showToast(`Report prepared successfully. Exporting as ${type}...`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">Analyze insurance performance, financial activity and operational trends.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <select className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
             <option>All Insurance Types</option>
             <option>Motor</option>
             <option>Health</option>
             <option>Life</option>
             <option>Home</option>
             <option>Business</option>
           </select>
           <select className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
             <option>Last 30 Days</option>
             <option>Last 7 Days</option>
             <option>Last 6 Months</option>
             <option>This Year</option>
             <option>Custom Range</option>
           </select>
           <div className="relative group">
             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
               <Download className="h-4 w-4" /> Export Report
             </button>
             <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
               <button onClick={() => handleExport('PDF')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export PDF</button>
               <button onClick={() => handleExport('CSV')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export CSV</button>
             </div>
           </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Premium" value="LKR 24.8M" icon={DollarSign} trend="+12.5%" color="blue" />
        <StatCard title="Claims Submitted" value="386" icon={AlertCircle} trend="+8.4%" color="slate" />
        <StatCard title="Claims Paid" value="LKR 8.4M" icon={Activity} color="red" />
        <StatCard title="Active Policies" value="9,842" icon={FileText} trend="+5.4%" color="green" />
        <StatCard title="New Customers" value="428" icon={Users} trend="+15%" color="blue" />
        <StatCard title="Approval Rate" value="78.5%" icon={CheckCircle} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Premium Revenue Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => `${value}M`} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claims Trend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Claims Trend (Submitted/Approved/Rejected)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={claimsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Line type="monotone" dataKey="submitted" stroke="#64748B" strokeWidth={2} dot={{r: 4}} />
                <Line type="monotone" dataKey="approved" stroke="#16A34A" strokeWidth={2} dot={{r: 4}} />
                <Line type="monotone" dataKey="rejected" stroke="#DC2626" strokeWidth={2} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Customer Growth</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="newCustomers" name="New Customers" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          {/* Policy Types */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Policies by Type</h2>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={policyDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {policyDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs">
              {policyDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Status</h2>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {paymentStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs">
              {paymentStatus.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;



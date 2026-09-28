import { useAnalytics } from '../../utils/useAnalytics';
import { money, download } from '../../utils/api';
import { useState } from 'react';
import React from 'react';
import { CheckCircle, Calendar, Download, DollarSign, AlertCircle, FileText, Users, Activity } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line } from 'recharts';
import { showToast } from '../../utils/toast';

const AdminReports = () => {
  const [days, setDays] = useState(30);
  const [type, setType] = useState('');
  const stats=useAnalytics(days,type);
  const { revenueData, claimsData, policyDistribution, recentClaims, paymentStatus, customerGrowth, claimsByType }=stats;

  const handleExport = (format) => download('/admin/export?kind=payments&format='+format.toLowerCase()+'&days='+days+'&type='+encodeURIComponent(type));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">Analyze insurance performance, financial activity and operational trends.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <select value={type} onChange={e=>setType(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
             <option>All Insurance Types</option>
             <option value="motor">Motor</option>
             <option value="health">Health</option>
             <option value="life">Life</option>
             <option value="home">Home</option>
             <option>Business</option>
           </select>
           <select value={days} onChange={e=>setDays(Number(e.target.value))} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
             <option value="30">Last 30 Days</option>
             <option value="7">Last 7 Days</option>
             <option value="180">Last 6 Months</option>
             <option value="365">Last Year</option>

           </select>
           <div className="relative group">
             <button onClick={()=>handleExport('CSV')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
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
        <StatCard title="Total Premium" value={money(stats.premium)} icon={DollarSign} color="blue" />
        <StatCard title="Claims Submitted" value={stats.claimsCount} icon={AlertCircle} color="slate" />
        <StatCard title="Claims Paid" value={money(stats.claimsPaid)} icon={Activity} color="red" />
        <StatCard title="Active Policies" value={stats.activePolicies} icon={FileText} color="green" />
        <StatCard title="New Customers" value={stats.newCustomers} icon={Users} color="blue" />
        <StatCard title="Approval Rate" value={stats.approvalRate + '%'} icon={CheckCircle} color="green" />
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
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => money(value)} />
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
                  <span className="font-semibold text-slate-900">{item.value}</span>
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
                  <span className="font-semibold text-slate-900">{item.value}</span>
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



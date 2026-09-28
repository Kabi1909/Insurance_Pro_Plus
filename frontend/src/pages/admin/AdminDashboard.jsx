import { useAnalytics } from '../../utils/useAnalytics';
import { money, download } from '../../utils/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import { Users, FileText, AlertCircle, DollarSign, Activity, Calendar } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

const AdminDashboard = () => {
  const [days, setDays] = useState(30);
  const [type, setType] = useState('');
  const stats=useAnalytics(days,type);
  const { revenueData, claimsData, policyDistribution, recentClaims, paymentStatus, customerGrowth, claimsByType }=stats;
  const navigate = useNavigate();
  const { admin } = useContext(AdminAuthContext);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, {admin?.name.split(' ')[0] || 'Admin'}</h1>
          <p className="text-slate-500">Here's what's happening with Insurance Pro Plus today.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={()=>setDays(days===30?365:30)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium">
             <Calendar className="h-4 w-4 text-slate-500" />
             Last {days} Days
           </button>
           <button onClick={()=>download('/admin/export?kind=payments&format=pdf&days='+days)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
             Generate Report
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Customers" value={stats.customers} icon={Users} trendLabel="this month" color="blue" />
        <StatCard title="Active Policies" value={stats.activePolicies} icon={FileText} color="green" />
        <StatCard title="Open Claims" value={stats.openClaims} icon={AlertCircle} color="yellow" />
        <StatCard title="Premium Collected" value={money(stats.premium)} icon={DollarSign} color="blue" />
        <StatCard title="Claims Paid" value={money(stats.claimsPaid)} icon={Activity} color="green" />
        <StatCard title="Expiring Policies" value={stats.expiring} icon={Calendar} trendLabel="Next 30 days" color="red" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Premium Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Premium Revenue</h2>
              <p className="text-sm text-slate-500">Total Premium Collected: {money(stats.premium)}</p>
            </div>
            <select value={days} onChange={e=>setDays(Number(e.target.value))} className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none">
              <option value="365">Last Year</option>
              <option value="30">Last 30 Days</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => money(value)} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claims Overview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Claims Overview</h2>
            <div className="flex gap-2">
              {['7D', '30D', '6M', '1Y'].map(f => (
                <button key={f} onClick={()=>setDays(({'7D':7,'30D':30,'6M':180,'1Y':365})[f])} className={`px-3 py-1 text-xs font-medium rounded-md ${days===({'7D':7,'30D':30,'6M':180,'1Y':365})[f] ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                <Bar dataKey="submitted" name="Submitted" fill="#64748B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Policy Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Policy Distribution</h2>
          <div className="h-64 relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={policyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {policyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">{stats.activePolicies}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Total Policies</span>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 mt-4">
            {policyDistribution.map((item, idx) => (
               <div key={idx} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                 <div className="flex-1 flex justify-between text-sm">
                   <span className="text-slate-600">{item.name}</span>
                   <span className="font-semibold text-slate-900">{item.value}</span>
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Claims</h2>
            <button onClick={() => navigate("/admin/claims")} className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All Claims</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="p-4">Claim ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {recentClaims.map((claim, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{claim.id}</td>
                    <td className="p-4">
                      <div>{claim.customer}</div>
                      <div className="text-xs text-slate-400">{claim.policy}</div>
                    </td>
                    <td className="p-4">{claim.type}</td>
                    <td className="p-4 font-medium">{claim.amount}</td>
                    <td className="p-4"><StatusBadge status={claim.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <button onClick={() => navigate(`/admin/claims/${claim.id}`)} className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-2 py-1 rounded">Review</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

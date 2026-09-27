import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FileText, AlertCircle, CreditCard, Shield, ChevronRight, Activity, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const storedPolicies = JSON.parse(localStorage.getItem('ipp_policies') || '[]');
    setPolicies(storedPolicies);
    const storedClaims = JSON.parse(localStorage.getItem('ipp_claims') || '[]');
    setClaims(storedClaims);
    const storedPayments = JSON.parse(localStorage.getItem('ipp_payments') || '[]');
    setPayments(storedPayments);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
        <h1 className="text-2xl font-bold text-textMain">Good morning, {user?.name}!</h1>
        <p className="text-textSecondary mt-1">Here's an overview of your insurance account.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Policies', value: policies.filter(p => p.status === 'Active').length.toString(), icon: Shield, color: 'text-primary', bg: 'bg-blue-50' },
          { label: 'Open Claims', value: claims.filter(c => c.status !== 'Completed').length.toString(), icon: AlertCircle, color: 'text-accent', bg: 'bg-yellow-50' },
          { label: 'Next Payment', value: '$250', icon: CreditCard, color: 'text-success', bg: 'bg-green-50' },
          { label: 'Total Coverage', value: '$850K', icon: FileText, color: 'text-secondary', bg: 'bg-teal-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-borderMain shadow-sm flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-textSecondary font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-textMain">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Policies & Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button onClick={() => navigate('/policies')} className="flex flex-col items-center justify-center p-4 border border-borderMain rounded-lg hover:border-primary hover:bg-blue-50 transition-colors group">
                <FileText className="h-6 w-6 text-textSecondary group-hover:text-primary mb-2" />
                <span className="text-xs font-medium text-textMain group-hover:text-primary">Renew Policy</span>
              </button>
              <button onClick={() => navigate('/claims/new')} className="flex flex-col items-center justify-center p-4 border border-borderMain rounded-lg hover:border-primary hover:bg-blue-50 transition-colors group">
                <AlertCircle className="h-6 w-6 text-textSecondary group-hover:text-primary mb-2" />
                <span className="text-xs font-medium text-textMain group-hover:text-primary">File a Claim</span>
              </button>
              <button onClick={() => navigate('/payments')} className="flex flex-col items-center justify-center p-4 border border-borderMain rounded-lg hover:border-primary hover:bg-blue-50 transition-colors group">
                <CreditCard className="h-6 w-6 text-textSecondary group-hover:text-primary mb-2" />
                <span className="text-xs font-medium text-textMain group-hover:text-primary">Make Payment</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border border-borderMain rounded-lg hover:border-primary hover:bg-blue-50 transition-colors group" onClick={() => document.querySelector('.fixed.bottom-6.right-6')?.click()}>
                <MessageSquare className="h-6 w-6 text-textSecondary group-hover:text-primary mb-2" />
                <span className="text-xs font-medium text-textMain group-hover:text-primary">Live Chat</span>
              </button>
            </div>
          </div>

          {/* My Policies */}
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-textMain">My Policies</h2>
              <Link to="/policies" className="text-sm text-primary hover:underline flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {policies.slice(0, 3).map(policy => (
                <div key={policy.id} className="border border-borderMain rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-textMain">{policy.name}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 font-medium">{policy.status}</span>
                    </div>
                    <p className="text-xs text-textSecondary mb-2">Policy No: {policy.id}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-textSecondary block text-xs">Coverage</span>
                        <span className="font-medium text-textMain">{policy.coverage}</span>
                      </div>
                      <div>
                        <span className="text-textSecondary block text-xs">Renewal Date</span>
                        <span className="font-medium text-textMain">{policy.renewalDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                    <button onClick={() => navigate(`/policies/${policy.id}`)} className="flex-1 px-4 py-2 border border-borderMain rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate(`/policies/${policy.id}?renew=true`)} 
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Renew Policy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Claim Status & Activity */}
        <div className="space-y-6">
          
          {/* Claim Status */}
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-textMain">Claim Status</h2>
              <Link to="/claims" className="text-sm text-primary hover:underline flex items-center">
                View All
              </Link>
            </div>
            {claims.length > 0 ? (
              <div className="border border-borderMain rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-textSecondary">{claims[0].id}</p>
                    <h3 className="font-semibold text-textMain">{claims[0].incident}</h3>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">{claims[0].status}</span>
                </div>
                
                {/* Progress Indicator */}
                <div className="mt-4 relative">
                  <div className="absolute top-2 left-2 right-2 h-0.5 bg-gray-200"></div>
                  <div className="absolute top-2 left-2 h-0.5 bg-primary w-1/3"></div>
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-white relative z-10 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                      </div>
                      <span className="text-[10px] text-textSecondary mt-1 text-center w-12">Submitted</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-white relative z-10 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                      </div>
                      <span className="text-[10px] font-medium text-primary mt-1 text-center w-16">Under Review</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200 ring-4 ring-white relative z-10"></div>
                      <span className="text-[10px] text-textSecondary mt-1 text-center w-12">Approved</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-4 rounded-full bg-gray-200 ring-4 ring-white relative z-10"></div>
                      <span className="text-[10px] text-textSecondary mt-1 text-center w-12">Completed</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-sm text-textSecondary">No open claims.</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl border border-borderMain shadow-sm">
            <h2 className="text-lg font-bold text-textMain mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { type: 'payment', title: 'Premium payment completed', desc: 'Business Property Insurance', time: '2 days ago', icon: CreditCard, color: 'text-success bg-green-100' },
                { type: 'claim', title: 'Claim submitted', desc: 'CLM-2026-0045 (Property Damage)', time: '1 week ago', icon: AlertCircle, color: 'text-accent bg-yellow-100' },
                { type: 'policy', title: 'Business policy renewed', desc: 'Employee Protection Plan', time: '1 month ago', icon: FileText, color: 'text-primary bg-blue-100' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-textMain">{activity.title}</p>
                    <p className="text-xs text-textSecondary">{activity.desc}</p>
                    <p className="text-[10px] text-textSecondary mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

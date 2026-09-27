import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, AlertCircle } from 'lucide-react';

const Claims = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedClaims = JSON.parse(localStorage.getItem('ipp_claims') || '[]');
    setClaims(storedClaims);
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = ['All Claims', 'Open', 'Approved', 'Completed'];

  const filteredClaims = claims.filter(c => {
    const isTabMatch = 
      activeTab === 'All Claims' || 
      (activeTab === 'Open' && c.status === 'Under Review') ||
      c.status === activeTab;
    const isSearchMatch = c.id.toLowerCase().includes(search.toLowerCase()) || c.policyName.toLowerCase().includes(search.toLowerCase());
    return isTabMatch && isSearchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-textMain">Claims Management</h1>
        <button 
          onClick={() => navigate('/claims/new')}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          File New Claim
        </button>
      </div>

      <div className="bg-white rounded-xl border border-borderMain shadow-sm overflow-hidden">
        {/* Tabs & Search */}
        <div className="p-4 border-b border-borderMain flex flex-col md:flex-row justify-between gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg self-start">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-white text-textMain shadow-sm' : 'text-textSecondary hover:text-textMain'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search claims..."
              className="w-full pl-10 pr-4 py-1.5 border border-borderMain rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Claims Table (Desktop) & Cards (Mobile) */}
        {filteredClaims.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-borderMain text-xs uppercase text-textSecondary font-medium">
                  <th className="p-4">Claim Number</th>
                  <th className="p-4">Policy</th>
                  <th className="p-4">Incident</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Claim Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderMain text-sm">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-textMain">{claim.id}</td>
                    <td className="p-4 text-textSecondary">{claim.policyName}</td>
                    <td className="p-4 text-textMain">{claim.incident}</td>
                    <td className="p-4 text-textSecondary">{claim.submittedDate}</td>
                    <td className="p-4 font-medium">{claim.amount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => navigate(`/claims/${claim.id}`)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-textMain">No claims found</h3>
            <p className="text-textSecondary mt-1">When you submit a claim, it will appear here.</p>
            {activeTab === 'All Claims' && !search && (
              <button 
                onClick={() => navigate('/claims/new')}
                className="mt-6 inline-flex items-center gap-2 bg-white border border-borderMain text-textMain px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" /> File Your First Claim
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Claims;

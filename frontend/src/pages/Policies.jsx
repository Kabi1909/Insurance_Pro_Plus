import { api } from '../utils/api';
import { showToast } from '../utils/toast';
import { readCollection } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, FileText } from 'lucide-react';

const Policies = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {

    const storedPolicies = await readCollection('ipp_policies');
    if (active) setPolicies(storedPolicies);

      } catch (error) { if (active) showToast(error.message, 'error'); }
    })();
    return () => { active = false; };
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPolicies = policies.filter(p => {
    const matchesFilter = filter === 'All' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-textMain">My Policies</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-borderMain shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', 'Active', 'Pending Payment', 'Expired', 'Cancelled', 'Suspended'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary text-white' : 'bg-gray-50 text-textSecondary hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            placeholder="Search policy number or name"
            className="w-full pl-10 pr-4 py-2 border border-borderMain rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPolicies.length > 0 ? filteredPolicies.map((policy) => (
          <div key={policy.id} className="bg-white rounded-xl border border-borderMain shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-50 text-primary rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-textMain">{policy.name}</h3>
                    <p className="text-xs text-textSecondary">{policy.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor(policy.status)}`}>
                  {policy.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="block text-xs text-textSecondary mb-1">Insurance Type</span>
                  <span className="text-sm font-medium text-textMain">{policy.type}</span>
                </div>
                <div>
                  <span className="block text-xs text-textSecondary mb-1">Coverage Amount</span>
                  <span className="text-sm font-medium text-textMain">{policy.coverage}</span>
                </div>
                <div>
                  <span className="block text-xs text-textSecondary mb-1">Premium</span>
                  <span className="text-sm font-medium text-textMain">{policy.premium}</span>
                </div>
                <div>
                  <span className="block text-xs text-textSecondary mb-1">Renewal Date</span>
                  <span className="text-sm font-medium text-textMain">{policy.renewalDate}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-4 border-t border-borderMain flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/policies/${policy.id}`)}
                className="flex-1 min-w-[120px] bg-white border border-borderMain text-textMain px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => navigate(`/policies/${policy.id}?renew=true`)}
                className="flex-1 min-w-[120px] bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Renew
              </button>
              <button onClick={async()=>{if(!window.confirm('Cancel this policy? Coverage will stop.'))return;try{await api('/policies/'+policy.id+'/cancel',{method:'POST',body:{}});setPolicies(list=>list.map(p=>p.id===policy.id?{...p,status:'Cancelled'}:p));}catch(e){showToast(e.message,'error');}}} disabled={policy.status==='Cancelled'}
                className="flex-1 min-w-[120px] bg-white border border-borderMain text-error px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Cancel Policy
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-1 md:col-span-2 bg-white p-12 rounded-xl border border-borderMain text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-textMain">No policies found</h3>
            <p className="text-textSecondary mt-1">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;

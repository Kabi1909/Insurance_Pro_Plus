import { api } from '../../utils/api';
import SupportInbox from '../../components/SupportInbox';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Search, ChevronDown, MessageSquare, LifeBuoy, FileText, Settings, Users, Shield } from 'lucide-react';
import { showToast } from '../../utils/toast';

const AdminHelp = () => {
  const navigate=useNavigate();const [search,setSearch]=useState('');

  const handleSupportSubmit = async e => {e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));try{const result=await api('/tickets',{method:'POST',body:{subject:data.subject,message:data.category+' / '+data.priority+': '+data.message}});showToast('Support request '+result.id+' saved.');form.reset();}catch(e){showToast(e.message,'error');}};

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-[#0F2747] rounded-xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Find answers or get assistance with Insurance Pro Plus administration.</p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="How can we help you?" value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-slate-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all text-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Managing Customers', icon: Users },
          { title: 'Managing Policies', icon: Shield },
          { title: 'Processing Claims', icon: FileText },
          { title: 'Payments & Revenue', icon: LifeBuoy },
        ].map((item, i) => (
          <div key={i} role="link" tabIndex={0} onClick={()=>navigate(['/admin/customers','/admin/policies','/admin/claims','/admin/payments'][i])} onKeyDown={e=>{if(e.key==='Enter')navigate(['/admin/customers','/admin/policies','/admin/claims','/admin/payments'][i]);}} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
               <item.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
             </div>
             <h3 className="font-bold text-slate-900">{item.title}</h3>
          </div>
        ))}
      </div>

      <SupportInbox admin/><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FAQs */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          {[
            { q: "How do I approve a claim?", a: "Navigate to the Claims section, select a claim to view its details, and click the 'Approve Claim' button in the top right. You must confirm the action in the popup dialog." },
            { q: "How do I assign a claims officer?", a: "In the Claim Details page, click 'Assign Officer'. A modal will appear allowing you to select an available claims officer from the dropdown." },
            { q: "How do I verify customer documents?", a: "Go to the Documents section, find the document that is 'Pending Verification', click 'Review', and then select 'Mark as Verified' in the document preview panel." },
            { q: "How do I create a staff account?", a: "Navigate to Staff Management and click '+ Add Staff Member'. Fill out the required details including their role and department, then submit." }
          ].filter(faq=>(faq.q+faq.a).toLowerCase().includes(search.toLowerCase())).map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm group">
              <summary className="p-4 font-bold text-slate-900 cursor-pointer flex justify-between items-center list-none">
                {faq.q}
                <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Support Form */}
        <div>
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
             <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Need more help?</h2>
                  <p className="text-xs text-slate-500">Contact internal IT support</p>
                </div>
             </div>

             <form onSubmit={handleSupportSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                 <input name="subject" required minLength={3} type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief summary" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                   <select name="category" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                     <option>Technical Issue</option>
                     <option>Account & Access</option>
                     <option>Claims System</option>
                     <option>Payment System</option>
                     <option>Other</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                   <select name="priority" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                     <option>Low</option>
                     <option>Medium</option>
                     <option>High</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                 <textarea name="message" required minLength={5} rows="4" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Provide details..."></textarea>
               </div>
               <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                 Submit Support Request
               </button>
             </form>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHelp;

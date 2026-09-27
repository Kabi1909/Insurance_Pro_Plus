import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');

  const faqs = [
    { q: "How do I renew my policy?", a: "You can renew your policy by logging into your account, navigating to 'My Policies', selecting the policy you want to renew, and clicking the 'Renew Policy' button. Follow the prompts to confirm and pay." },
    { q: "How can I submit a claim?", a: "To submit a claim, log into your account, go to the 'Claims' section, and click 'File New Claim'. You will be guided through a simple 4-step process to provide incident details and upload supporting documents." },
    { q: "How can I track my claim?", a: "Your claim status is visible on your Dashboard under 'Claim Status' or in the 'Claims' section. You can click on any claim to view a detailed timeline of its progress." },
    { q: "What payment methods are supported?", a: "We currently support major Credit/Debit Cards (Visa, MasterCard, Amex) and direct Bank Transfers for premium payments." },
    { q: "Can I cancel a policy online?", a: "Yes, you can initiate a policy cancellation from the 'Policy Details' page. Please note that cancellation terms and potential refunds depend on your specific policy terms." },
    { q: "Is my information secure?", a: "Absolutely. We use industry-standard encryption to protect your personal information and payment details. We comply with all relevant data protection regulations." },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-textMain mb-4">Frequently Asked Questions</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-textSecondary" />
          <input 
            type="text" 
            placeholder="Search for answers..."
            className="w-full pl-12 pr-4 py-3 border border-borderMain rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-borderMain rounded-lg shadow-sm overflow-hidden">
            <button 
              className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <span className="font-medium text-textMain text-left">{faq.q}</span>
              {openIdx === idx ? <ChevronUp className="h-5 w-5 text-textSecondary" /> : <ChevronDown className="h-5 w-5 text-textSecondary" />}
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-4 pt-2 border-t border-borderMain bg-gray-50 text-textSecondary text-sm leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
        {filteredFaqs.length === 0 && (
          <div className="text-center text-textSecondary py-8">
            No questions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;

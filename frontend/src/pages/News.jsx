import Modal from '../components/admin/Modal';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';

const News = () => {const [article,setArticle]=useState(null);return (
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <Modal isOpen={!!article} onClose={()=>setArticle(null)} title={article?.t||'News'} maxWidth="max-w-2xl"><div className="space-y-4 text-slate-600"><p>{['Start with an inventory of your business assets, vehicles and employee needs. Compare the coverage benefits and exclusions in each insurance product before requesting an estimate. Keep your contact details and supporting documents up to date.', 'Registered customers can submit claims for active policies, attach supporting documents, track status and exchange messages with the support team from the claim details page.', 'Business property insurance helps protect business premises and assets against the events listed in your policy. Review the coverage amount, eligibility and exclusions, then describe your business and desired coverage when requesting a quote.'][article?.index]}</p><Link to={article?.index===1?'/public-claims':'/products/bp'} className="text-primary font-semibold">{article?.index===1?'Explore claims':'Explore business coverage'}</Link></div></Modal><h1 className="text-3xl font-bold text-textMain mb-8">Insurance News & Updates</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { t: "How to Protect Your Small Business in 2026", d: "Oct 15, 2026", cat: "Business Guides", image: "small-business", alt: "Small-business owner reviewing inventory at a shop counter" },
        { t: "New Online Claim Features Available", d: "Oct 01, 2026", cat: "Product Update", image: "online-claims", alt: "Customer completing an online insurance claim on a laptop" },
        { t: "Understanding Business Property Insurance", d: "Sep 20, 2026", cat: "Education", image: "business-property", alt: "Modern commercial office and warehouse with a landscaped entrance" },
      ].map((n, i) => (
        <div key={i} className="bg-white rounded-xl border border-borderMain overflow-hidden shadow-sm flex flex-col">
          <img src={`/images/news/${n.image}.png`} alt={n.alt} loading="lazy" decoding="async" width="1536" height="1024" className="h-48 w-full object-cover object-center" />
          <div className="p-6 flex-1 flex flex-col">
            <span className="text-xs font-medium text-primary mb-2">{n.cat}</span>
            <h3 className="text-lg font-bold text-textMain mb-2">{n.t}</h3>
            <p className="text-xs text-textSecondary mb-4">{n.d}</p>
            <p className="text-sm text-textSecondary mb-6 flex-1">Insurance trends and guides to help you make the best decisions for your future.</p>
            <button onClick={()=>setArticle({...n,index:i})} className="text-primary font-medium text-sm self-start hover:underline">Read More</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);};

export default News;

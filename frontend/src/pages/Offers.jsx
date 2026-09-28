import { Link } from 'react-router-dom';
import Modal from '../components/admin/Modal';
import { useState } from 'react';
import React from 'react';

const Offers = () => { const [open,setOpen]=useState(false);return (
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <Modal isOpen={open} onClose={()=>setOpen(false)} title="Business bundle offer"><p className="text-slate-600 mb-4">When you have active, paid business property or commercial vehicle insurance, get a 20% discount on a new quote for the other product. Eligibility is checked when the quote is calculated.</p><div className="flex gap-3"><Link className="text-blue-600 font-semibold" to="/products/bp?quote=1&offer=bundle20">Property quote</Link><Link className="text-blue-600 font-semibold" to="/products/bv?quote=1&offer=bundle20">Vehicle quote</Link></div></Modal><h1 className="text-3xl font-bold text-textMain mb-8">Special Offers & Discounts</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold -mt-8 -mr-4">%</div>
         <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded mb-4 inline-block">BUSINESS EXCLUSIVE</span>
         <h2 className="text-2xl font-bold mb-2">20% Business Insurance Discount</h2>
         <p className="text-blue-100 mb-6 max-w-md">Save 20% when combining property and commercial vehicle insurance. Secure your business for less.</p>
         <button onClick={()=>setOpen(true)} className="bg-white text-primary px-6 py-2.5 rounded-md font-bold hover:bg-gray-100 transition-colors">View Offer</button>
      </div>
      <div className="bg-white border border-borderMain p-8 rounded-xl shadow-sm">
         <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mb-4 inline-block">ALL CUSTOMERS</span>
         <h2 className="text-xl font-bold text-textMain mb-2">Annual Payment Discount</h2>
         <p className="text-textSecondary mb-6">Get 2 months free when you switch your monthly premium to an annual payment plan.</p>
         <Link to="/products/bp?quote=1&cycle=annual" className="inline-block border border-primary text-primary px-6 py-2.5 rounded-md font-bold hover:bg-blue-50 transition-colors">Apply Discount</Link>
      </div>
    </div>
  </div>
);};

export default Offers;

import QuoteFlow from '../components/QuoteFlow';
import React, { useState } from 'react';
import { Shield, Home, Car, Heart, Briefcase, Zap, ShieldAlert, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [filter, setFilter] = useState('All');

  const products = [
    { id: 'health', type: 'Individual', icon: Heart, name: 'Health Insurance', desc: 'Comprehensive medical coverage for you and your family.', benefits: ['Doctor visits', 'Hospital stays', 'Prescription drugs'] },
    { id: 'life', type: 'Individual', icon: Shield, name: 'Life Insurance', desc: 'Protect your family\'s financial future with term or whole life coverage.', benefits: ['Tax-free benefit', 'Flexible terms', 'Rider options'] },
    { id: 'motor', type: 'Individual', icon: Car, name: 'Motor Insurance', desc: 'Coverage for accidents, theft, and third-party liabilities.', benefits: ['24/7 Roadside', 'Zero depreciation', 'Quick claim'] },
    { id: 'home', type: 'Individual', icon: Home, name: 'Home Insurance', desc: 'Protect your house and belongings against fire, theft, and natural disasters.', benefits: ['Property protection', 'Valuables cover', 'Liability protection'] },

    { id: 'bp', type: 'Business', icon: Briefcase, name: 'Business Property Insurance', desc: 'Protect your physical assets, equipment, and inventory.', benefits: ['Building cover', 'Equipment breakdown', 'Business interruption'] },
    { id: 'bv', type: 'Business', icon: Car, name: 'Commercial Vehicle', desc: 'Coverage for your business fleet and company cars.', benefits: ['Fleet discounts', 'Liability cover', 'Employee drivers'] },
    { id: 'ep', type: 'Business', icon: Users, name: 'Employee Insurance', desc: 'Group health and protection plans for your workforce.', benefits: ['Group health', 'Workers comp', 'Dental/Vision'] },
    { id: 'cyber', type: 'Business', icon: Zap, name: 'Cyber Insurance', desc: 'Protection against data breaches and cyber attacks.', benefits: ['Data recovery', 'Legal costs', 'Ransomware cover'] },
    { id: 'liability', type: 'Business', icon: ShieldAlert, name: 'Liability Insurance', desc: 'Protect your business against legal claims and lawsuits.', benefits: ['General liability', 'Professional indemnity', 'Legal fees'] },
  ];

  const filteredProducts = products.filter(p => filter === 'All' || p.type === filter);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {quoteProduct && <QuoteFlow product={quoteProduct} onClose={() => setQuoteProduct(null)} />}
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Insurance Solutions for Every Need</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">Discover comprehensive protection plans tailored for individuals and businesses.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

        {/* Filters */}
        <div className="bg-white p-2 rounded-lg shadow-md inline-flex mb-8">
          {['All', 'Individual', 'Business'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'text-textSecondary hover:bg-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-borderMain p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                  <product.icon className="h-6 w-6" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.type === 'Business' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                  {product.type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-textMain mb-2">{product.name}</h3>
              <p className="text-textSecondary text-sm mb-6 flex-1">{product.desc}</p>

              <div className="mb-6">
                <h4 className="text-xs font-semibold text-textMain uppercase tracking-wider mb-2">Key Benefits</h4>
                <ul className="space-y-1.5">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="text-sm text-textSecondary flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"></div>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3 mt-auto">
                <button onClick={() => navigate(`/products/${product.id}`)} className="flex-1 bg-white border border-borderMain text-textMain py-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors">
                  Learn More
                </button>
                <button onClick={() => setQuoteProduct(product)} className="flex-1 bg-primary text-white py-2 rounded-md font-medium text-sm hover:bg-primary-dark transition-colors">
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

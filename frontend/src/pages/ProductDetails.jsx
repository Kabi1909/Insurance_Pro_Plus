import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, ChevronRight, CheckCircle, XCircle, ArrowRight, Phone } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="md:w-2/3">
             <nav className="flex text-sm text-blue-200 mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li><Link to="/" className="hover:text-white">Home</Link></li>
                  <li><ChevronRight className="h-4 w-4" /></li>
                  <li><Link to="/products" className="hover:text-white">Products</Link></li>
                  <li><ChevronRight className="h-4 w-4" /></li>
                  <li className="text-white font-medium">Details</li>
                </ol>
             </nav>
            <h1 className="text-4xl font-bold mb-4">Comprehensive Coverage</h1>
            <p className="text-lg text-blue-100 mb-6">Protect what matters most with our flexible and tailored insurance plans designed specifically for your needs.</p>
            <div className="flex gap-4">
               <button className="bg-white text-primary px-6 py-3 rounded-md font-bold hover:bg-gray-100 transition-colors">Get a Quote</button>
               <button className="border border-blue-400 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-800 transition-colors flex items-center gap-2">
                 <Phone className="h-4 w-4" /> Contact Advisor
               </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
             <Shield className="h-32 w-32 text-blue-300 opacity-80" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-borderMain">
              <h2 className="text-2xl font-bold text-textMain mb-4">What's Covered</h2>
              <ul className="space-y-4">
                {['Accidental damage and loss', 'Third-party liabilities', 'Legal expenses coverage', 'Emergency support 24/7'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                     <CheckCircle className="h-6 w-6 text-success shrink-0" />
                     <span className="text-textSecondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-borderMain">
              <h2 className="text-2xl font-bold text-textMain mb-4">What's Not Covered</h2>
              <ul className="space-y-4">
                {['Intentional damage or negligence', 'Pre-existing conditions before policy start', 'Wear and tear over time'].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                     <XCircle className="h-6 w-6 text-error shrink-0" />
                     <span className="text-textSecondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-borderMain">
              <h2 className="text-2xl font-bold text-textMain mb-4">Eligibility</h2>
              <p className="text-textSecondary leading-relaxed">Available to individuals aged 18-65 and registered businesses operating within the country. Subject to standard underwriting criteria.</p>
            </div>

          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-borderMain">
                <h3 className="font-bold text-textMain mb-4">Key Benefits</h3>
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                     <div className="h-8 w-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center shrink-0">1</div>
                     <div>
                       <h4 className="font-semibold text-textMain text-sm">Fast Claims</h4>
                       <p className="text-xs text-textSecondary">Average processing time under 48 hours.</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="h-8 w-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center shrink-0">2</div>
                     <div>
                       <h4 className="font-semibold text-textMain text-sm">Flexible Payments</h4>
                       <p className="text-xs text-textSecondary">Choose monthly or annual premiums.</p>
                     </div>
                   </div>
                   <div className="flex items-start gap-3">
                     <div className="h-8 w-8 bg-blue-50 text-primary rounded-lg flex items-center justify-center shrink-0">3</div>
                     <div>
                       <h4 className="font-semibold text-textMain text-sm">Global Coverage</h4>
                       <p className="text-xs text-textSecondary">Protection wherever you go.</p>
                     </div>
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-xl text-white">
                <h3 className="font-bold mb-2">Still have questions?</h3>
                <p className="text-sm text-blue-100 mb-4">Our advisors are ready to help you find the perfect plan.</p>
                <Link to="/faq" className="flex items-center gap-2 text-sm font-bold hover:underline">
                  Read Product FAQ <ArrowRight className="h-4 w-4" />
                </Link>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;

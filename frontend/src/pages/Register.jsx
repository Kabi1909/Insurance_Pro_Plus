import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  ChevronDown, 
  Building2, 
  FileText, 
  CreditCard, 
  Headphones, 
  ArrowRight,
  Shield
} from 'lucide-react';


const Register = () => {
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    accountType: 'Individual', // default explicit as requested
    businessName: '',
    terms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    
    if (!formData.email) newErrors.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8) newErrors.password = "Password must contain at least 8 characters.";
    
    if (formData.password && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    if (!formData.country) newErrors.country = "Please select your country.";
    if (!formData.accountType) newErrors.accountType = "Please select an account type.";
    
    if (formData.accountType === 'Business' && !formData.businessName) {
      newErrors.businessName = "Business name is required for business accounts.";
    }
    
    if (!formData.terms) newErrors.terms = "Please accept the Terms & Conditions and Privacy Policy.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setErrors({ general: 'Account registration is currently unavailable. Please contact support for access.' });
  };

  // Minimal Password Strength logic
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { label: '', color: 'bg-transparent' };
    if (p.length < 5) return { label: 'Weak', color: 'bg-red-500 w-1/3' };
    if (p.length < 8 || !/\d/.test(p)) return { label: 'Medium', color: 'bg-yellow-500 w-2/3' };
    return { label: 'Strong', color: 'bg-green-500 w-full' };
  };
  const strength = getPasswordStrength();

  return (
    <div className="w-full min-h-[calc(100vh-75px)] flex flex-col lg:flex-row bg-white font-sans">
      
      {/* Shared cover for Individual and Business accounts. Keep copy in normal flow. */}
      <section className="w-full lg:w-[54%] shrink-0 bg-[#F6FAFF] px-6 py-10 sm:px-10 lg:p-12 xl:p-16">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-2 text-xs sm:text-sm font-semibold text-blue-700 mb-6">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" /> For individuals and businesses
          </div>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#071A3D] mb-5">
            Start Your Insurance <span className="text-[#0866FF]">Journey</span>
          </h1>
          <p className="text-lg leading-relaxed text-[#52627A] mb-8">
            Create an account and explore insurance solutions for yourself, your family and your business.
          </p>
          <div className="hidden lg:grid grid-cols-2 gap-x-6 gap-y-7 mb-10">
            {[
              { icon: Shield, title: 'Wide Range of Plans', text: 'Personal and business cover in one place.' },
              { icon: FileText, title: 'Policy Management', text: 'Keep your insurance details organized.' },
              { icon: CreditCard, title: 'Payment Overview', text: 'Stay informed about your premiums.' },
              { icon: Headphones, title: 'Helpful Support', text: 'Find answers when you need them.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="w-6 h-6 text-[#0866FF] mb-3" aria-hidden="true" />
                <h2 className="font-bold text-[#071A3D] mb-1">{title}</h2>
                <p className="text-sm text-[#52627A] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <figure className="overflow-hidden rounded-2xl border border-[#D8E4F2] bg-white shadow-sm">
            <img src="/images/businesswoman.jpg" alt="Professional working on a laptop" className="w-full h-56 sm:h-72 lg:h-80 object-cover object-center" />
            <figcaption className="bg-[#0F2747] p-5 sm:p-6 text-white">
              <p className="text-xl font-bold mb-2">Your future. Your business. Your peace of mind.</p>
              <p className="text-sm leading-relaxed text-blue-100">A simpler way to explore protection for what matters to you.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* RIGHT SECTION (46%) */}
      <div className="w-full lg:w-[46%] bg-gradient-to-b from-[#F6FAFF] to-white flex flex-col items-center justify-center py-10 px-4 sm:px-8 relative overflow-y-auto">
        
        {/* Main Register Card */}
        <div className="w-full max-w-[560px] bg-white rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#D8E4F2] p-6 sm:p-10 my-auto">
          
            <>
              <div className="mb-8">
                <h2 className="text-[36px] sm:text-[40px] font-bold text-[#071A3D] mb-2 tracking-tight leading-tight">Create Your Account</h2>
                <p className="text-[15px] text-[#52627A]">Join Insurance Pro Plus and start your insurance journey today.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <p className="text-sm text-textSecondary">Account registration is currently unavailable. Contact support for access.</p>
                {errors.general && <p role="alert" className="text-red-600">{errors.general}</p>}
                
                {/* Full Name */}
                <div>
                  <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#A0B0C7]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full h-[52px] pl-11 pr-4 bg-white border ${errors.fullName ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] text-[#071A3D] placeholder-[#A0B0C7] focus:outline-none focus:ring-4 transition-all`}
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  {errors.fullName && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#A0B0C7]" />
                    </div>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className={`w-full h-[52px] pl-11 pr-4 bg-white border ${errors.email ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] text-[#071A3D] placeholder-[#A0B0C7] focus:outline-none focus:ring-4 transition-all`}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#A0B0C7]" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className={`w-full h-[52px] pl-11 pr-11 bg-white border ${errors.password ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] text-[#071A3D] placeholder-[#A0B0C7] focus:outline-none focus:ring-4 transition-all`}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button" 
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A0B0C7] hover:text-[#071A3D] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password}</p>}
                  
                  {formData.password && !errors.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300`}></div>
                      </div>
                      <span className="text-[11px] font-medium text-[#52627A] w-12 text-right">{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#A0B0C7]" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className={`w-full h-[52px] pl-11 pr-11 bg-white border ${errors.confirmPassword ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] text-[#071A3D] placeholder-[#A0B0C7] focus:outline-none focus:ring-4 transition-all`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <button 
                      type="button" 
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A0B0C7] hover:text-[#071A3D] transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.confirmPassword}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Country</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-[#A0B0C7]" />
                    </div>
                    <select
                      className={`w-full h-[52px] pl-11 pr-11 bg-white border ${errors.country ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] ${formData.country ? 'text-[#071A3D]' : 'text-[#A0B0C7]'} appearance-none focus:outline-none focus:ring-4 transition-all cursor-pointer`}
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                    >
                      <option value="" disabled>Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="IN">India</option>
                      <option value="SG">Singapore</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-[#A0B0C7]" />
                    </div>
                  </div>
                  {errors.country && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.country}</p>}
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Account Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Individual */}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, accountType: 'Individual'})}
                      className={`flex items-center gap-3 p-4 border rounded-[8px] text-left transition-all ${
                        formData.accountType === 'Individual' 
                          ? 'border-[#0866FF] bg-[#EAF5FF] ring-1 ring-[#0866FF]' 
                          : 'border-[#D8E4F2] bg-white hover:border-[#A0B0C7]'
                      }`}
                    >
                      <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${formData.accountType === 'Individual' ? 'bg-[#0866FF]/10' : 'bg-gray-100'}`}>
                        <User className={`w-5 h-5 ${formData.accountType === 'Individual' ? 'text-[#0866FF]' : 'text-[#52627A]'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#071A3D] text-[14px]">Individual</h4>
                        <p className="text-[#52627A] text-[12px] leading-tight mt-0.5">For personal insurance needs</p>
                      </div>
                    </button>

                    {/* Business */}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, accountType: 'Business'})}
                      className={`flex items-center gap-3 p-4 border rounded-[8px] text-left transition-all ${
                        formData.accountType === 'Business' 
                          ? 'border-[#0866FF] bg-[#EAF5FF] ring-1 ring-[#0866FF]' 
                          : 'border-[#D8E4F2] bg-white hover:border-[#A0B0C7]'
                      }`}
                    >
                      <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 ${formData.accountType === 'Business' ? 'bg-[#0866FF]/10' : 'bg-gray-100'}`}>
                        <Building2 className={`w-5 h-5 ${formData.accountType === 'Business' ? 'text-[#0866FF]' : 'text-[#52627A]'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#071A3D] text-[14px]">Business</h4>
                        <p className="text-[#52627A] text-[12px] leading-tight mt-0.5">For business insurance needs</p>
                      </div>
                    </button>
                  </div>
                  {errors.accountType && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.accountType}</p>}
                </div>

                {/* Business Name (Conditional) */}
                {formData.accountType === 'Business' && (
                  <div className="animate-fade-in-up">
                    <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Business Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-[#A0B0C7]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your business name"
                        className={`w-full h-[52px] pl-11 pr-4 bg-white border ${errors.businessName ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] text-[#071A3D] placeholder-[#A0B0C7] focus:outline-none focus:ring-4 transition-all`}
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                    {errors.businessName && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.businessName}</p>}
                  </div>
                )}

                {/* Terms */}
                <div className="pt-2 pb-1">
                  <label className="flex items-start cursor-pointer group">
                    <div className="mt-0.5 flex-shrink-0">
                      <input 
                        type="checkbox" 
                        className={`w-[18px] h-[18px] text-[#0866FF] border-[#D8E4F2] rounded focus:ring-[#0866FF] transition-colors ${errors.terms ? 'border-red-400' : ''}`}
                        checked={formData.terms}
                        onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                      />
                    </div>
                    <span className="ml-2.5 text-[14px] text-[#52627A] leading-snug select-none">
                      I agree to the <a href="#" className="font-semibold text-[#0866FF] hover:underline">Terms & Conditions</a> and <a href="#" className="font-semibold text-[#0866FF] hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.terms && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.terms}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-[52px] flex justify-center items-center gap-2 rounded-[8px] font-bold text-[16px] text-white bg-[#0866FF] hover:bg-[#0057E7] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-[0_4px_14px_rgba(8,102,255,0.25)]"
                  >
                    <>Create Account <ArrowRight className="w-5 h-5" /></>
                  </button>
                </div>

                {/* Login Link */}
                <div className="pt-4 text-center">
                  <span className="text-[15px] text-[#52627A]">Already have an account? </span>
                  <Link to="/login" className="text-[15px] font-bold text-[#0866FF] hover:text-[#0057E7] transition-colors">
                    Login
                  </Link>
                </div>
              </form>
            </>
        </div>

      </div>
    </div>
  );
};

export default Register;

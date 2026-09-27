import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Quote, 
  ArrowRight,
  Shield
} from 'lucide-react';


const Register = () => {
  const navigate = useNavigate();
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      
      {/* LEFT SECTION (54%) */}
      <div className="hidden lg:flex w-[54%] bg-[#F6FAFF] relative overflow-hidden flex-col pt-12 pl-12 xl:pl-20">
        
        {/* Top Badge */}
        <div className="relative z-10 flex items-center gap-2 bg-[#EAF5FF] w-max px-3 py-1.5 rounded-full mb-6">
          <ShieldCheck className="w-4 h-4 text-[#0866FF]" />
          <span className="text-[#0866FF] text-[13px] font-semibold">Trusted by Individuals and Businesses</span>
        </div>

        {/* Headings */}
        <div className="relative z-10 max-w-[520px]">
          <h1 className="text-[54px] xl:text-[60px] font-[800] leading-[1.1] text-[#071A3D] mb-4 tracking-tight">
            Start Your <br />
            Insurance <span className="text-[#0866FF]">Journey</span>
          </h1>
          <p className="text-[18px] xl:text-[20px] text-[#52627A] leading-relaxed mb-10 max-w-[500px]">
            Create an account and get access to complete insurance solutions for you and your business.
          </p>
          
          {/* Features Vertical List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#EAF5FF] flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#0866FF]" fill="currentColor" strokeWidth={1} />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Wide Range of Plans</h3>
                <p className="text-[#52627A] text-[15px]">Personal and business insurance in one place.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#10A66A]" />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Easy Policy Management</h3>
                <p className="text-[#52627A] text-[15px]">View, renew or cancel anytime.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#FFF3E5] flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-[#FF8A1F]" />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Secure Payments</h3>
                <p className="text-[#52627A] text-[15px]">Multiple payment options</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-[#7137E8]" />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">24/7 Support</h3>
                <p className="text-[#52627A] text-[15px]">Always here to help.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EAF5FF] rounded-full blur-[80px] opacity-60 -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#EAF5FF] rounded-full blur-[100px] opacity-60 translate-y-1/4 -translate-x-1/4 z-0"></div>

        {/* Woman Image Area */}
        <div className="absolute bottom-0 right-0 w-[65%] max-w-[600px] h-[75%] z-10 pointer-events-none">
           <img 
             src="/images/businesswoman.jpg" 
             alt="Professional working on laptop" 
             className="w-full h-full object-cover object-left-top rounded-tl-[80px]" 
           />
           
           {/* Gradient overlay to fade the image into the background on the left and top */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#F6FAFF] via-[#F6FAFF]/70 to-transparent w-[45%]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-[#F6FAFF] via-[#F6FAFF]/30 to-transparent h-[25%]"></div>
        </div>

        {/* Floating Testimonial Card */}
        <div className="absolute bottom-[60px] left-[40px] xl:left-[80px] bg-white/95 backdrop-blur-sm p-6 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] max-w-[360px] z-20">
           <Quote className="w-8 h-8 text-[#0866FF] mb-3 opacity-80" fill="currentColor" strokeWidth={0} />
           <p className="text-[#071A3D] font-medium text-[15px] leading-relaxed mb-3">
             “Insurance Pro Plus made it easy for me to protect my family and business. The registration process was simple and quick!”
           </p>
           <p className="text-[#52627A] text-[13px] mb-2">— Albert, Small Business Owner</p>
           <div className="flex gap-1">
             {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-[#FFB000]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
           </div>
        </div>
      </div>

      {/* RIGHT SECTION (46%) */}
      <div className="w-full lg:w-[46%] bg-gradient-to-b from-[#F6FAFF] to-white flex flex-col items-center justify-center py-10 px-4 sm:px-8 relative overflow-y-auto">
        
        {/* Main Register Card */}
        <div className="w-full max-w-[560px] bg-white rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#D8E4F2] p-6 sm:p-10 my-auto">
          
          {isSuccess ? (
            <div className="text-center py-12 animate-fade-in-up">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#ECFDF5] mb-6">
                <ShieldCheck className="h-8 w-8 text-[#10A66A]" />
              </div>
              <h2 className="text-[28px] font-bold text-[#071A3D] mb-3">Account created successfully!</h2>
              <p className="text-[#52627A]">Redirecting you to the login page...</p>
            </div>
          ) : (
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
                    disabled={isLoading}
                    className="w-full h-[52px] flex justify-center items-center gap-2 rounded-[8px] font-bold text-[16px] text-white bg-[#0866FF] hover:bg-[#0057E7] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-[0_4px_14px_rgba(8,102,255,0.25)]"
                  >
                    {isLoading ? 'Creating Account...' : (
                      <>Create Account <ArrowRight className="w-5 h-5" /></>
                    )}
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
          )}
        </div>

      </div>
    </div>
  );
};

export default Register;

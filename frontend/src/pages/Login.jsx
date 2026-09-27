import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Mail, Lock, FileText, CreditCard, Headphones, BarChart3, Quote, ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { ADMIN_EMAIL, normalizeEmail, isCustomerCredentials } from '../utils/credentials';
import { getDemoUser } from '../utils/demoData';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { login: loginAdmin } = useContext(AdminAuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);

  const fillDemoCredentials = () => {
    setFormData({ email: 'albert@demo.com', password: 'Albert123' });
    setErrors({});
    setDemoNotice(true);
    setTimeout(() => setDemoNotice(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) newErrors.email = "Please enter a valid email address.";
    
    if (!formData.password) newErrors.password = "Password is required.";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    setErrors({});
    try {
      if (normalizeEmail(formData.email) === ADMIN_EMAIL) {
        await loginAdmin(formData.email, formData.password);
        navigate('/admin/dashboard', { replace: true });
      } else if (isCustomerCredentials(formData.email, formData.password)) {
        login(getDemoUser());
        navigate('/dashboard', { replace: true });
      } else {
        setErrors({ general: 'Email or password is incorrect.' });
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-75px)] flex flex-col lg:flex-row bg-[#F5FAFF] font-sans">
      
      {/* LEFT SECTION (54%) */}
      <div className="hidden lg:flex w-[54%] bg-[#EAF5FF] relative overflow-hidden flex-col pt-12 pl-12 xl:pl-20">
        
        {/* Headings */}
        <div className="relative z-10 max-w-[500px]">
          <h1 className="text-[50px] xl:text-[56px] font-[800] leading-[1.1] text-[#071A3D] mb-4 tracking-tight">
            Welcome Back to <br />
            Insurance <span className="text-[#0866FF]">Pro Plus</span>
          </h1>
          <p className="text-[18px] xl:text-[20px] text-[#2c3b59] leading-relaxed mb-10">
            Log in to manage your policies, submit claims, make payments and access all your insurance services in one secure place.
          </p>
          
          {/* Features Vertical List */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#D4E8FF] flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#0866FF]" fill="currentColor" strokeWidth={1} />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Manage Your Policies</h3>
                <p className="text-[#52627A] text-[15px]">View, renew or cancel anytime</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-[#0EAD72]" />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Submit Claims Easily</h3>
                <p className="text-[#52627A] text-[15px]">Track your claim status in real time</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-[#FF8A1F]" />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Make Secure Payments</h3>
                <p className="text-[#52627A] text-[15px]">Multiple payment options</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-[48px] h-[48px] rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-[#7137E8]" />
              </div>
              <div>
                <h3 className="font-bold text-[#071A3D] text-[17px]">Get 24/7 Support</h3>
                <p className="text-[#52627A] text-[15px]">Live chat, email or phone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Businessman Image Area */}
        <div className="absolute bottom-0 right-0 w-[75%] max-w-[650px] h-[85%] z-0">
           {/* The image itself */}
           <img src="/images/businessman.jpg" alt="Businessman" className="w-full h-full object-cover object-left-top rounded-tl-[80px]" />
           
           {/* Gradient overlay to fade the image into the background on the left and top */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#EAF5FF] via-[#EAF5FF]/80 to-transparent w-[50%]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-[#EAF5FF] via-[#EAF5FF]/40 to-transparent h-[30%]"></div>
        </div>

        {/* Floating Testimonial Card */}
        <div className="absolute bottom-[40px] left-[40px] xl:left-[80px] bg-white/90 backdrop-blur-sm p-6 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-[340px] z-20">
           <Quote className="w-8 h-8 text-[#0866FF] mb-3 opacity-80" fill="currentColor" strokeWidth={0} />
           <p className="text-[#071A3D] font-medium text-[15px] leading-relaxed mb-3">
             “Insurance Pro Plus makes managing our business insurance simple and stress-free.”
           </p>
           <p className="text-[#52627A] text-[13px] mb-2">— Albert, Small Business Owner</p>
           <div className="flex gap-1">
             {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 text-[#FFB000]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
           </div>
        </div>

        {/* Floating Protection Card */}
        <div className="absolute bottom-[100px] right-[30px] xl:right-[50px] bg-white p-5 rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-[260px] z-20 flex gap-4 pr-12">
           <div className="w-[40px] h-[40px] rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
             <BarChart3 className="w-5 h-5 text-[#0EAD72]" />
           </div>
           <div>
             <h4 className="font-bold text-[#071A3D] text-[15px] leading-tight mb-1">Your Protection<br/>Our Priority</h4>
             <p className="text-[#52627A] text-[12px] leading-tight">Manage your insurance anytime, anywhere.</p>
           </div>
           
           {/* Circular Arrow */}
           <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-[#52627A] hover:bg-[#071A3D] cursor-pointer transition-colors flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-white" />
           </div>
        </div>
      </div>

      {/* RIGHT SECTION (46%) */}
      <div className="w-full lg:w-[46%] bg-gradient-to-b from-[#F8FBFF] to-white flex flex-col items-center justify-center py-10 px-4 sm:px-8 relative overflow-y-auto">
        
        {/* Main Login Card */}
        <div className="w-full max-w-[560px] bg-white rounded-[16px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#D8E4F2] p-8 sm:p-10 mb-6">
          <h2 className="text-[34px] sm:text-[38px] font-bold text-[#071A3D] mb-2 tracking-tight">Login to Your Account</h2>
          <p className="text-[15px] text-[#52627A] mb-8">Welcome back! Please enter your details to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="p-3 bg-red-50 text-red-600 text-[14px] rounded-lg border border-red-200">
                {errors.general}
              </div>
            )}
            
            {/* Email Field */}
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
              {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[14px] font-bold text-[#071A3D] mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#A0B0C7]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full h-[52px] pl-11 pr-11 bg-white border ${errors.password ? 'border-red-400 focus:ring-red-500/20' : 'border-[#D8E4F2] focus:border-[#0866FF] focus:ring-[#0866FF]/20'} rounded-[8px] text-[15px] text-[#071A3D] placeholder-[#A0B0C7] focus:outline-none focus:ring-4 transition-all`}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A0B0C7] hover:text-[#071A3D] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Remember & Forgot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-[18px] h-[18px] text-[#0866FF] border-[#D8E4F2] rounded focus:ring-[#0866FF]" />
                <span className="ml-2.5 text-[15px] text-[#52627A]">Remember me</span>
              </label>
              <a href="#" className="text-[14px] font-bold text-[#0866FF] hover:text-[#0057E7] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] flex justify-center items-center gap-2 rounded-[8px] font-bold text-[16px] text-white bg-[#0866FF] hover:bg-[#0057E7] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-[0_4px_14px_rgba(8,102,255,0.25)]"
              >
                {isLoading ? 'Logging in...' : (
                  <>Login <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>

            {/* Create Account Link (Moved up to replace social login) */}
            <div className="pt-6 text-center">
              <span className="text-[15px] text-[#52627A]">Don't have an account? </span>
              <Link to="/register" className="text-[15px] font-bold text-[#0866FF] hover:text-[#0057E7] transition-colors">
                Create Account
              </Link>
            </div>
          </form>
        </div>

        {/* Demo Credentials Card */}
        <div 
          onClick={fillDemoCredentials}
          className="w-full max-w-[560px] bg-[#F5FAFF] border border-[#0866FF]/20 rounded-[10px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#eef6ff] transition-colors group relative"
        >
           <div className="flex gap-3">
             <div className="w-[36px] h-[36px] rounded-full bg-[#0866FF]/10 flex items-center justify-center shrink-0">
               <GraduationCap className="w-5 h-5 text-[#0866FF]" />
             </div>
             <div>
               <h4 className="font-bold text-[#071A3D] text-[14px]">Demo Credentials (For Testing)</h4>
               <p className="text-[#52627A] text-[13px]">Click to use the following credentials to explore the system:</p>
             </div>
           </div>
           
           <div className="hidden sm:block w-px h-10 bg-[#D8E4F2] shrink-0"></div>
           
           <div className="text-[13px] bg-white sm:bg-transparent p-3 sm:p-0 rounded border sm:border-0 border-[#D8E4F2] w-full sm:w-auto">
              <div className="flex gap-2 mb-1"><span className="text-[#52627A]">Email:</span> <strong className="text-[#071A3D]">albert@demo.com</strong></div>
              <div className="flex gap-2"><span className="text-[#52627A]">Password:</span> <strong className="text-[#071A3D]">Albert123</strong></div>
           </div>

           {demoNotice && (
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#071A3D] text-white text-[12px] py-1.5 px-3 rounded-md shadow-lg transition-all duration-300 whitespace-nowrap">
               Demo credentials filled
             </div>
           )}
        </div>

        {/* Trust Features (Bottom) */}
        <div className="w-full max-w-[560px] mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <Lock className="w-6 h-6 text-[#071A3D] mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h5 className="font-bold text-[#071A3D] text-[13px]">Secure Login</h5>
            <p className="text-[#52627A] text-[11px] mt-0.5">Your data is protected</p>
          </div>
          <div className="text-center">
            <ShieldCheck className="w-6 h-6 text-[#071A3D] mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h5 className="font-bold text-[#071A3D] text-[13px]">Privacy Secured</h5>
            <p className="text-[#52627A] text-[11px] mt-0.5">We respect your privacy</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-6 h-6 text-[#071A3D] mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h5 className="font-bold text-[#071A3D] text-[13px]">Safe Payments</h5>
            <p className="text-[#52627A] text-[11px] mt-0.5">Secure transactions</p>
          </div>
          <div className="text-center">
            <Headphones className="w-6 h-6 text-[#071A3D] mx-auto mb-2 opacity-80" strokeWidth={1.5} />
            <h5 className="font-bold text-[#071A3D] text-[13px]">24/7 Support</h5>
            <p className="text-[#52627A] text-[11px] mt-0.5">Always here for you</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../../context/AdminAuthContext';
import { Shield, Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      // Simulating a professional toast
      const toast = document.createElement('div');
      toast.className = "fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center font-medium";
      toast.innerHTML = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Login successful`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0F2747] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Insurance Pro Plus</span>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Insurance operations,<br />simplified.
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Securely manage customers, policies, claims and insurance operations from one powerful, centralized administration portal.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm">© 2026 Insurance Pro Plus. Internal System.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
             <Shield className="h-8 w-8 text-blue-600" />
             <span className="text-2xl font-bold text-slate-900">Insurance Pro Plus</span>
          </div>
          
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Administration Portal</h2>
            <p className="text-slate-500">Sign in with your authorized staff account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                 <AlertCircle className="h-5 w-5 shrink-0" />
                 {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="admin-email" className="text-sm font-semibold text-slate-700 block">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  id="admin-email" autoComplete="username" type="email" 
                  required
                  placeholder="name@insuranceproplus.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-password" className="text-sm font-semibold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  id="admin-password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link to="/support" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center shadow-md disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 font-medium tracking-wide">
            AUTHORIZED INSURANCE PRO PLUS PERSONNEL ONLY.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

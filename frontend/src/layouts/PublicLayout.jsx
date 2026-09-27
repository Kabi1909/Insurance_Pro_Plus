import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Search, ChevronDown } from 'lucide-react';

const PublicLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FBFF] text-[#081A3A] font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-[#E4ECF7] sticky top-0 z-50 h-[75px] flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8">
          <div className="flex justify-between items-center w-full">
            {/* Logo Area */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-[#0866FF] rounded-full p-1.5 flex items-center justify-center shadow-[0_2px_10px_rgba(8,102,255,0.2)]">
                  <Shield className="h-6 w-6 text-white" fill="currentColor" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-none tracking-tight">
                    <span className="text-[#071A3D]">Insurance</span> <span className="text-[#0866FF]">Pro Plus</span>
                  </span>
                  <span className="text-[10px] font-medium text-[#52627A] mt-0.5 tracking-wide">Secure Today, Brighter Tomorrow</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation (Center) */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className={`text-[15px] font-semibold transition-colors relative py-2 ${isActive('/') ? 'text-[#0866FF]' : 'text-[#52627A] hover:text-[#0866FF]'}`}>
                Home
                {isActive('/') && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#0866FF] rounded-t-sm"></span>}
              </Link>
              <Link to="/products" className="flex items-center gap-1 cursor-pointer group py-2 text-[15px] font-semibold text-[#52627A] hover:text-[#0866FF] transition-colors"><span>Insurance</span><ChevronDown className="h-4 w-4" /></Link>
              <Link to="/public-claims" className={`text-[15px] font-semibold transition-colors relative py-2 ${isActive('/public-claims') ? 'text-[#0866FF]' : 'text-[#52627A] hover:text-[#0866FF]'}`}>
                Claims
              </Link>
              <Link to="/faq" className="flex items-center gap-1 cursor-pointer group py-2 text-[15px] font-semibold text-[#52627A] hover:text-[#0866FF] transition-colors"><span>Resources</span><ChevronDown className="h-4 w-4" /></Link>
              <Link to="/about" className={`text-[15px] font-semibold transition-colors relative py-2 ${isActive('/about') ? 'text-[#0866FF]' : 'text-[#52627A] hover:text-[#0866FF]'}`}>
                About
              </Link>
            </nav>

            {/* Right Navigation */}
            <div className="hidden md:flex items-center space-x-5">
              <button className="text-[#081A3A] hover:text-[#0866FF] transition-colors p-2">
                <Search className="h-5 w-5" />
              </button>
              {location.pathname === '/login' ? (
                <>
                  <Link to="/support" className="text-[#081A3A] font-semibold hover:text-[#0866FF] transition-colors text-sm">
                    Help
                  </Link>
                  <Link to="/register" className="text-[#0866FF] border border-[#0866FF] bg-white font-semibold hover:bg-[#F8FBFF] transition-colors px-6 py-2.5 rounded-lg text-sm">
                    Register
                  </Link>
                  <Link to="/login" className="bg-[#0866FF] text-white font-semibold hover:bg-blue-700 transition-colors px-6 py-2.5 rounded-lg text-sm shadow-[0_2px_10px_rgba(8,102,255,0.2)]">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-[#0866FF] border border-[#0866FF] bg-white font-semibold hover:bg-[#F8FBFF] transition-colors px-6 py-2.5 rounded-lg text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="bg-[#0866FF] text-white font-semibold hover:bg-blue-700 transition-colors px-6 py-2.5 rounded-lg text-sm shadow-[0_2px_10px_rgba(8,102,255,0.2)]">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden gap-4">
              <button className="text-[#081A3A] md:hidden">
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#081A3A]"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[75px] left-0 right-0 bg-white border-b border-[#E4ECF7] lg:hidden shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
              <Link to="/" className="block px-3 py-3 rounded-md text-base font-semibold text-[#0866FF] bg-[#EAF4FF]" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <div className="px-3 py-3 rounded-md text-base font-semibold text-[#081A3A] flex justify-between">Insurance <ChevronDown className="h-5 w-5 text-[#52627A]"/></div>
              <Link to="/public-claims" className="block px-3 py-3 rounded-md text-base font-semibold text-[#081A3A]" onClick={() => setIsMobileMenuOpen(false)}>Claims</Link>
              <div className="px-3 py-3 rounded-md text-base font-semibold text-[#081A3A] flex justify-between">Resources <ChevronDown className="h-5 w-5 text-[#52627A]"/></div>
              <Link to="/about" className="block px-3 py-3 rounded-md text-base font-semibold text-[#081A3A]" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              
              <div className="mt-6 pt-6 border-t border-[#E4ECF7] flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center text-[#0866FF] border border-[#0866FF] font-semibold py-3 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-[#0866FF] text-white font-semibold py-3 rounded-lg shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative w-full">
        <Outlet />
      </main>

      {/* Simplified Footer aligned with the aesthetic */}
      <footer className="bg-white border-t border-[#E4ECF7] mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-[#0866FF]" fill="currentColor" strokeWidth={1} />
                <span className="text-lg font-bold text-[#071A3D]">Insurance Pro Plus</span>
              </div>
             <p className="text-sm text-[#52627A]">&copy; 2026 Insurance Pro Plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;



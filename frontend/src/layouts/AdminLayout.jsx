import ThemeToggle from '../components/ThemeToggle';
import { paymentText } from '../utils/paymentText';
import PasswordDialog from '../components/PasswordDialog';
import { api } from '../utils/api';
import { showToast } from '../utils/toast';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import {
  LayoutDashboard, Users, FileText, AlertCircle, CreditCard, Folder, Bell,
  BarChart2, UserCog, ShieldCheck, Settings, LogOut, Menu, X, Search, HelpCircle, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import ConfirmDialog from '../components/admin/ConfirmDialog';

const AdminLayout = () => {
  const { admin, logout, loading } = useContext(AdminAuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDrop, setShowSearchDrop] = useState(false);

  const notifRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSearchDrop(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [results,setResults]=useState([]); const [notifications,setNotifications]=useState([]);
  useEffect(()=>{if(!admin)return;let active=true;const timer=setTimeout(()=>api('/admin/search?q='+encodeURIComponent(searchQuery)).then(v=>{if(active)setResults(v);}).catch(e=>{if(active)showToast(e.message,'error');}),250);return()=>{active=false;clearTimeout(timer);};},[admin,searchQuery]);
  useEffect(()=>{if(!admin)return;let active=true;api('/notifications').then(v=>{if(active)setNotifications(v);}).catch(e=>{if(active)showToast(e.message,'error');});return()=>{active=false;};},[admin,location.pathname,showNotifications]);
  const currentAdmin = admin;

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your account...</div>;
  if (!currentAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if(currentAdmin.mustChangePassword)return <PasswordDialog onClose={()=>{}}/>;
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Policies', path: '/admin/policies', icon: FileText },
    { name: 'Claims', path: '/admin/claims', icon: AlertCircle },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Documents', path: '/admin/documents', icon: Folder },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
    { name: 'Staff Management', path: '/admin/staff', icon: UserCog },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Helper to generate dynamic breadcrumbs based on route
  const getBreadcrumbs = () => {
    const path = location.pathname.replace('/admin', '');
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) return [{ name: 'Dashboard' }];

    return parts.map((part, index) => {
      const name = part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' ');
      // If it's an ID (usually second part)
      if (index === 1 && (parts[0] === 'customers' || parts[0] === 'policies' || parts[0] === 'claims' || parts[0] === 'staff')) {
         return { name: part.toUpperCase() };
      }
      return { name };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0F2747] text-white transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 shrink-0 bg-[#0A1A30]">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="bg-blue-600 p-1.5 rounded text-white shrink-0">
               <ShieldCheck className="h-6 w-6" />
             </div>
             {!collapsed && <span className="font-bold text-lg whitespace-nowrap tracking-tight">Insurance Pro</span>}
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                      ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-[#1A365D] hover:text-white hover:translate-x-0.5'}
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.name : ''}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
                    {collapsed && (
                      <div className="absolute left-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-700/50 bg-[#0A1A30] shrink-0 space-y-1">
          <Link to="/admin/help" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-[#1A365D] hover:text-white transition-colors group relative ${collapsed ? 'justify-center' : ''}`}>
             <HelpCircle className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-white" />
             {!collapsed && <span className="text-sm font-medium">Help & Support</span>}
          </Link>
          <div
             onClick={() => navigate('/admin/profile')}
             className={`flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-[#1A365D] transition-colors cursor-pointer group relative ${collapsed ? 'justify-center' : ''}`}
          >
             <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600 group-hover:border-blue-400 transition-colors">
               <span className="text-xs font-bold text-white">{currentAdmin.name.charAt(0)}</span>
             </div>
             {!collapsed && (
               <div className="min-w-0 flex-1">
                 <p className="text-sm font-medium text-white truncate">{currentAdmin.name}</p>
                 <p className="text-[10px] text-slate-400 truncate">{currentAdmin.role}</p>
               </div>
             )}
          </div>
          <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors group relative ${collapsed ? 'justify-center' : ''}`}
            onClick={() => setShowLogoutConfirm(true)}
          >
             <LogOut className="h-5 w-5 shrink-0" />
             {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-4 lg:px-6 z-30">

          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-800 p-1"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <button
              className="hidden lg:block text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-md transition-colors"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-500">
               <span className="text-slate-400">Admin</span>
               {breadcrumbs.map((crumb, idx) => (
                 <React.Fragment key={idx}>
                   <span className="mx-2 text-slate-300">/</span>
                   <span className={idx === breadcrumbs.length - 1 ? 'text-slate-900 font-semibold' : ''}>{crumb.name}</span>
                 </React.Fragment>
               ))}
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-end">

            <ThemeToggle />
            <div className="relative hidden md:block w-64 lg:w-80" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, policy, claim..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDrop(e.target.value.length > 0);
                  }}
                  onFocus={() => { if(searchQuery) setShowSearchDrop(true) }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              {showSearchDrop && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                   <div className="p-2">{results.map(r=><button key={r.id} onClick={()=>{navigate(r.link);setShowSearchDrop(false);}} className="block w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg"><p className="text-sm font-semibold">{r.name}</p><p className="text-xs text-slate-500">{r.kind} · {r.id}</p></button>)}{!results.length&&<p className="p-3 text-sm text-slate-500">No matching records.</p>}
                   </div>
                </div>
              )}
            </div>



            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-slate-400 hover:text-slate-600 p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg relative transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n=>!n.read)&&<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <span className="font-bold text-slate-900">Notifications</span>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{notifications.filter(n=>!n.read).length} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">{notifications.slice(0,5).map(n=><button key={n.id} onClick={()=>{navigate(n.link||'/admin/notifications');setShowNotifications(false);}} className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50"><p className="text-sm font-medium">{paymentText(n.title)}</p><p className="text-xs text-slate-500">{n.message}</p></button>)}{!notifications.length&&<p className="p-4 text-sm text-slate-500">No notifications.</p>}
                  </div>
                  <div
                    className="p-3 bg-slate-50 text-center border-t border-slate-100 text-sm font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    onClick={() => { setShowNotifications(false); navigate('/admin/notifications'); }}
                  >
                    View All Notifications
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors" onClick={() => navigate('/admin/profile')}>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">{currentAdmin.name}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">{currentAdmin.role}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm text-blue-700 font-bold">
                {currentAdmin.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out?"
        message="Are you sure you want to sign out of the administration portal?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText="Sign Out"
        type="warning"
      />
    </div>
  );
};

export default AdminLayout;

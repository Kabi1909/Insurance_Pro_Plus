import ThemeToggle from '../components/ThemeToggle';
import { paymentText } from '../utils/paymentText';
import PasswordDialog from '../components/PasswordDialog';
import PublicSearch from '../components/PublicSearch';
import { api } from '../utils/api';
import { showToast } from '../utils/toast';
import React, { useContext, useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Shield,
  Home,
  FileText,
  AlertCircle,
  CreditCard,
  Package,
  Tag,
  Newspaper,
  HelpCircle,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import LiveChat from '../components/LiveChat';

const AuthLayout = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [searchOpen,setSearchOpen]=useState(false);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications,setNotifications]=useState([]);
  useEffect(()=>{if(!user)return;let active=true;api('/notifications').then(v=>{if(active)setNotifications(v);}).catch(e=>{if(active)showToast(e.message,'error');});return()=>{active=false;};},[user,location.pathname,showNotifications]);
  if (loading) return <div className="p-8 text-center text-slate-500">Loading your account...</div>;
  if (!user) {
    return <Navigate to={"/login?next=" + encodeURIComponent(location.pathname + location.search)} replace />;
  }

  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Policies', path: '/policies', icon: FileText },
    { name: 'Claims', path: '/claims', icon: AlertCircle },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Insurance Products', path: '/products', icon: Package },
    { name: 'Offers', path: '/offers', icon: Tag },
    { name: 'News', path: '/news', icon: Newspaper },
    { name: 'Support', path: '/support', icon: MessageSquare },
    { name: 'FAQs', path: '/faq', icon: HelpCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if(user.mustChangePassword)return <PasswordDialog onClose={()=>{}}/>;
  const handleLogout = () => {
    logout();
  };



  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {searchOpen&&<PublicSearch customer onClose={()=>setSearchOpen(false)}/>}
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-borderMain z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-borderMain shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-textMain">Insurance Pro Plus</span>
          </Link>
          <button className="md:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-textSecondary" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-primary'
                    : 'text-textSecondary hover:bg-gray-50 hover:text-textMain'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-textSecondary'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-borderMain">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-error hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-borderMain flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-textSecondary hover:text-textMain"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
              <input
                type="text"
                placeholder="Search..." onFocus={()=>setSearchOpen(true)} readOnly
                className="pl-10 pr-4 py-2 border border-borderMain rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="relative">
              <button
                className="p-2 text-textSecondary hover:text-textMain hover:bg-gray-100 rounded-full relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n=>!n.read)&&<span className="absolute top-1.5 right-1.5 h-2 w-2 bg-error rounded-full ring-2 ring-white"></span>}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-borderMain overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-borderMain flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-textMain">Notifications</h3>
                    <button onClick={async()=>{try{await api('/notifications/all',{method:'PATCH',body:{read:true}});setNotifications(list=>list.map(n=>({...n,read:true})));}catch(e){showToast(e.message,'error');}}} className="text-xs text-primary hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif, idx) => (
                      <Link to={notif.link||'/dashboard'} onClick={()=>setShowNotifications(false)} key={notif.id} className="block px-4 py-3 border-b border-borderMain last:border-b-0 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm text-textMain">{paymentText(notif.title)}: {notif.message}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-md transition-colors">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-textMain leading-none">{user.name}</p>
                <p className="text-xs text-textSecondary mt-1">{user.accountType} Account</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <LiveChat />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-textMain mb-2">Log out of Insurance Pro Plus?</h3>
            <p className="text-textSecondary mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-borderMain rounded-md text-textMain hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-error text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import { Bell, FileText, CheckCircle, CreditCard, Shield, AlertCircle, RefreshCw, Check } from 'lucide-react';

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('ipp_admin_notifications') || '[]');
    setNotifications(data);
  }, []);

  const tabs = ['All', 'Unread', 'Claims', 'Policies', 'Payments', 'Documents'];

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    return n.category === activeTab;
  });

  const getIcon = (category) => {
    switch(category) {
      case 'Claims': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'Payments': return <CreditCard className="h-5 w-5 text-red-600" />;
      case 'Policies': return <Shield className="h-5 w-5 text-blue-600" />;
      case 'Documents': return <FileText className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  const getIconBg = (category) => {
    switch(category) {
      case 'Claims': return 'bg-yellow-100';
      case 'Payments': return 'bg-red-100';
      case 'Policies': return 'bg-blue-100';
      case 'Documents': return 'bg-green-100';
      default: return 'bg-slate-100';
    }
  };

  const toggleRead = (id, currentRead) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !currentRead } : n);
    setNotifications(updated);
    localStorage.setItem('ipp_admin_notifications', JSON.stringify(updated));
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('ipp_admin_notifications', JSON.stringify(updated));
  };

  const handleNotifClick = (notif) => {
    if (!notif.read) toggleRead(notif.id, false);
    if (notif.category === 'Claims') navigate(`/admin/claims/${notif.resourceId}`);
    if (notif.category === 'Policies') navigate(`/admin/policies/${notif.resourceId}`);
    if (notif.category === 'Documents') navigate(`/admin/documents`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500">Stay updated on important insurance operations and activities.</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
          <Check className="h-4 w-4" /> Mark All as Read
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="All Notifications" value={notifications.length} icon={Bell} color="blue" />
        <StatCard title="Unread" value={notifications.filter(n => !n.read).length} color="yellow" />
        <StatCard title="Requires Attention" value="12" color="red" />
        <StatCard title="Today" value="28" color="slate" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        {/* Tabs */}
        <div className="p-4 border-b border-slate-200 overflow-x-auto hide-scrollbar">
           <div className="flex gap-2">
             {tabs.map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               >
                 {tab}
                 {tab === 'Unread' && notifications.filter(n => !n.read).length > 0 && (
                   <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                     {notifications.filter(n => !n.read).length}
                   </span>
                 )}
               </button>
             ))}
           </div>
        </div>

        {/* Content */}
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle className="h-8 w-8 text-green-500" />
             </div>
             <h3 className="text-lg font-bold text-slate-900 mb-1">You're all caught up</h3>
             <p className="text-slate-500">No new notifications require your attention.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
             {filteredNotifs.map((notif) => (
                <div key={notif.id} className={`p-4 sm:p-6 flex gap-4 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                   <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notif.category)}`}>
                     {getIcon(notif.category)}
                   </div>
                   <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleNotifClick(notif)}>
                     <div className="flex items-start justify-between gap-4 mb-1">
                        <h4 className={`text-sm font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                          {!notif.read && <span className="inline-block w-2 h-2 rounded-full bg-blue-600 ml-2 mb-0.5"></span>}
                        </h4>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{notif.time}</span>
                     </div>
                     <p className="text-sm text-slate-600 mb-2">{notif.description}</p>
                     <div className="flex items-center gap-3 mt-2">
                       <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{notif.category}</span>
                       {notif.resourceId && <span className="text-xs font-medium text-blue-600 hover:underline">{notif.resourceId}</span>}
                     </div>
                   </div>
                   <div className="shrink-0 flex items-start">
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleRead(notif.id, notif.read); }}
                       className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                       title={notif.read ? "Mark as unread" : "Mark as read"}
                     >
                       {notif.read ? <RefreshCw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                     </button>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;

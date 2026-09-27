import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusStr) => {
    const s = statusStr.toLowerCase();
    if (['active', 'approved', 'paid', 'verified', 'completed'].includes(s)) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (['pending', 'under review', 'pending verification', 'additional information required'].includes(s)) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    if (['rejected', 'failed', 'cancelled', 'overdue', 'suspended'].includes(s)) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (['expiring soon'].includes(s)) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

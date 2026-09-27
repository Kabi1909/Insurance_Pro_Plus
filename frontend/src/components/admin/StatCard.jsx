import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = "blue" }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
      </div>
      {(trend || trendLabel) && (
        <div className="flex items-center text-sm">
          {trend && (
             <span className={`font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
               {trend}
             </span>
          )}
          {trendLabel && (
             <span className="text-slate-500 ml-2">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;

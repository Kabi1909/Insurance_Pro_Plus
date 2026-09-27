import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) => {
  if (!isOpen) return null;

  const iconMap = {
    warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    danger: <AlertTriangle className="h-6 w-6 text-red-600" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />,
    info: <Info className="h-6 w-6 text-blue-600" />
  };

  const bgMap = {
    warning: "bg-yellow-100",
    danger: "bg-red-100",
    success: "bg-green-100",
    info: "bg-blue-100"
  };

  const buttonMap = {
    warning: "bg-yellow-500 hover:bg-yellow-600",
    danger: "bg-red-600 hover:bg-red-700",
    success: "bg-green-600 hover:bg-green-700",
    info: "bg-blue-600 hover:bg-blue-700"
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${bgMap[type]}`}>
          {iconMap[type]}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-2 px-4 text-white font-medium rounded-lg transition-colors ${buttonMap[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

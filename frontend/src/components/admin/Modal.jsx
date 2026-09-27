import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, isOpen, onClose, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm overflow-y-auto">
      <div className={`bg-white rounded-xl w-full ${maxWidth} shadow-2xl my-auto`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

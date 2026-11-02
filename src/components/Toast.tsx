import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-500/30 shadow-emerald-950/20'
                : isError
                ? 'bg-rose-950/95 text-rose-100 border-rose-500/30 shadow-rose-950/20'
                : 'bg-slate-900/95 text-slate-100 border-slate-700/60 shadow-slate-950/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 shrink-0" />}
              <span className="text-xs font-bold leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;

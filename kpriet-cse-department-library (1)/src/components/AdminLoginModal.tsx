import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('cse.librarian');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Support common demo admin credentials
    const cleanPass = password.trim().toLowerCase();
    if (
      cleanPass === 'admin' ||
      cleanPass === 'admin123' ||
      cleanPass === 'cseadmin' ||
      cleanPass === 'kpriet' ||
      cleanPass === '123456'
    ) {
      setError('');
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid librarian password. Try "admin123" or "cseadmin".');
    }
  };

  const handleQuickDemoLogin = () => {
    setError('');
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                CSE Librarian & Admin Login
              </h3>
              <p className="text-xs text-slate-400">Department of Computer Science & Engineering</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Restricted Department Management Portal</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Login to access Excel book upload, book issuing, returns desk, student circulation history, and rack configuration.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Staff / Librarian ID</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-amber-500/50"
              placeholder="e.g. cse.librarian"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Admin Password</label>
              <span className="text-[10px] text-amber-400 font-mono">Demo: admin123</span>
            </div>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:ring-2 focus:ring-amber-500/50"
              placeholder="Enter password (e.g. admin123)"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              id="btn-admin-login-submit"
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Login as CSE Librarian</span>
            </button>

            <button
              id="btn-quick-admin-demo"
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click Instant Admin Access (Demo Mode)</span>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          Students can browse available books and ask the AI chatbot without logging in.
        </div>
      </div>
    </div>
  );
};

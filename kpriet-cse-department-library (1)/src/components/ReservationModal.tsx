import React, { useState } from 'react';
import { X, Bookmark, User, Phone, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Book } from '../types';

interface ReservationModalProps {
  book: Book;
  onClose: () => void;
  onConfirmReservation: (bookId: string, studentData: { name: string; rollNo: string; email: string; phone: string }) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  book,
  onClose,
  onConfirmReservation,
}) => {
  const [name, setName] = useState('Karthik Raja S');
  const [rollNo, setRollNo] = useState('711122104030');
  const [email, setEmail] = useState('karthik.711122104030@kpriet.ac.in');
  const [phone, setPhone] = useState('+91 98422 30030');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) {
      setErrorMsg('Name and Roll Number are required.');
      return;
    }

    onConfirmReservation(book.id, {
      name: name.trim(),
      rollNo: rollNo.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Reserve / Hold Book</h3>
              <p className="text-xs text-slate-400">Queue for notification upon return</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Book synopsis */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-amber-400 font-mono font-semibold">{book.accessionNo}</span>
            <div className="font-bold text-slate-100 text-sm">{book.title}</div>
            <div className="text-slate-400">By {book.author}</div>
            <div className="text-[10px] text-rose-400 pt-1">
              Currently all {book.totalCopies} copies are checked out. You will be added to the priority hold queue.
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Karthik Raja S"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Roll Number / Register ID *</label>
            <input
              type="text"
              required
              placeholder="e.g. 711122104030"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Notification Email</label>
            <input
              type="email"
              placeholder="e.g. name@kpriet.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Contact Mobile Number</label>
            <input
              type="tel"
              placeholder="+91 98422 30030"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-reserve"
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Hold Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

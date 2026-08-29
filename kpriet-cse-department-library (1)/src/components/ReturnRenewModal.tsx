import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, RotateCcw, DollarSign, BookCheck, ShieldAlert } from 'lucide-react';
import { IssueRecord } from '../types';
import { calculateOverdueInfo } from '../services/storageService';

interface ReturnRenewModalProps {
  issue: IssueRecord;
  onClose: () => void;
  onConfirmReturn: (returnParams: {
    issueId: string;
    returnDate: string;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
    finePaid: boolean;
    fineWaived?: boolean;
    remarks?: string;
  }) => void;
}

export const ReturnRenewModal: React.FC<ReturnRenewModalProps> = ({
  issue,
  onClose,
  onConfirmReturn,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueInfo = calculateOverdueInfo(issue.dueDate);
  const isOverdue = overdueInfo.isOverdue;
  const initialFine = overdueInfo.fine;

  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Damaged'>('Good');
  const [fineWaived, setFineWaived] = useState<boolean>(false);
  const [finePaid, setFinePaid] = useState<boolean>(!isOverdue);
  const [remarks, setRemarks] = useState('');

  const finalFine = fineWaived ? 0 : initialFine;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReturn({
      issueId: issue.id,
      returnDate: todayStr,
      condition,
      finePaid: finePaid || fineWaived,
      fineWaived,
      remarks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Process Book Return</h3>
              <p className="text-xs text-slate-400">KPRIET CSE Library • Check-in & Quality Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Issue summary Card */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-slate-400">{issue.transactionId}</span>
              <span className="font-mono text-amber-400">{issue.accessionNo}</span>
            </div>
            <div className="font-bold text-sm text-slate-100">{issue.bookTitle}</div>
            <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>
                Borrower: <strong className="text-slate-200">{issue.borrowerName}</strong> ({issue.borrowerRollNo})
              </span>
              <span>Copy: <strong className="text-amber-400 font-mono">{issue.copyId}</strong></span>
            </div>
          </div>

          {/* Date Comparison & Overdue Check */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400">Scheduled Due Date:</span>
              <div className="font-mono font-bold text-slate-200 mt-0.5">{issue.dueDate}</div>
            </div>
            <div>
              <span className="text-slate-400">Return Date (Today):</span>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">{todayStr}</div>
            </div>
          </div>

          {/* Fine calculation block */}
          {isOverdue ? (
            <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-300 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{overdueInfo.daysOverdue} Days Overdue Penalty</span>
                </div>
                <span className="font-mono font-bold text-lg text-rose-400">₹{initialFine}</span>
              </div>
              <p className="text-[11px] text-rose-300/80">
                Calculated at standard KPRIET CSE Department rate of ₹2.00 / day overdue.
              </p>

              <div className="pt-2 border-t border-rose-900/60 flex flex-col gap-2">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fineWaived}
                    onChange={(e) => {
                      setFineWaived(e.target.value === 'true' || e.target.checked);
                      if (e.target.checked) setFinePaid(false);
                    }}
                    className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Waive fine (HoD / Library Coordinator Special Approval)</span>
                </label>

                {!fineWaived && (
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={finePaid}
                      onChange={(e) => setFinePaid(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Fine received & paid by student (₹{initialFine})</span>
                  </label>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center justify-between text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Returned on time! No overdue fine applicable.</span>
              </div>
              <span className="font-mono font-bold">₹0.00</span>
            </div>
          )}

          {/* Book physical condition inspection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Physical Condition on Return</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Excellent', 'Good', 'Fair', 'Damaged'] as const).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setCondition(cond)}
                  className={`py-2 px-2 rounded-lg border text-center font-medium text-[11px] transition-all ${
                    condition === cond
                      ? cond === 'Damaged'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks input */}
          <div className="space-y-1">
            <label className="font-medium text-slate-300">Return Remarks & Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Pages verified intact, spine good."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-return"
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Return & Restock Shelf</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

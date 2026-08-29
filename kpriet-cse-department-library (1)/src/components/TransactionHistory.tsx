import React, { useState, useMemo } from 'react';
import { History, Download, Search, CheckCircle2, AlertTriangle, RefreshCw, RotateCcw, Calendar, FileSpreadsheet, Trash2 } from 'lucide-react';
import { IssueRecord } from '../types';

interface TransactionHistoryProps {
  issues: IssueRecord[];
  onExportCsv: () => void;
  onResetDefaults: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  issues,
  onExportCsv,
  onResetDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'returned' | 'overdue' | 'renewed'>('ALL');

  const filteredRecords = useMemo(() => {
    return issues.filter((rec) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        rec.transactionId.toLowerCase().includes(query) ||
        rec.bookTitle.toLowerCase().includes(query) ||
        rec.borrowerName.toLowerCase().includes(query) ||
        rec.borrowerRollNo.toLowerCase().includes(query) ||
        rec.accessionNo.toLowerCase().includes(query) ||
        rec.copyId.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [issues, searchTerm, statusFilter]);

  const returnedCount = useMemo(() => issues.filter((i) => i.status === 'returned').length, [issues]);
  const activeCount = useMemo(() => issues.filter((i) => i.status === 'active' || i.status === 'renewed' || i.status === 'overdue').length, [issues]);
  const totalFinePaid = useMemo(() => issues.filter((i) => i.finePaid).reduce((sum, i) => sum + (i.fineAmount || 0), 0), [issues]);

  return (
    <div className="space-y-6">
      {/* Control Header & Stats */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500" />
              Issue & Return Records Maintenance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete archival log of book checkouts, returns, physical condition checks, and fine collections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-history-export"
              onClick={onExportCsv}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Records (.CSV)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all library records to KPRIET CSE default catalog state?')) {
                  onResetDefaults();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              title="Reset records to default demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Audit Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Total Recorded Transactions:</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">{issues.length}</div>
          </div>

          <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/40">
            <span className="text-emerald-400">Completed Returns:</span>
            <div className="text-base font-bold text-emerald-300 font-mono mt-0.5">{returnedCount}</div>
          </div>

          <div className="bg-blue-950/30 p-2.5 rounded-lg border border-blue-800/40">
            <span className="text-blue-400">Currently Active Checkouts:</span>
            <div className="text-base font-bold text-blue-300 font-mono mt-0.5">{activeCount}</div>
          </div>

          <div className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
            <span className="text-amber-400">Total Fines Collected:</span>
            <div className="text-base font-bold text-amber-300 font-mono mt-0.5">₹{totalFinePaid}</div>
          </div>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-history-input"
              type="text"
              placeholder="Search history by Roll No, Student Name, Title, TX ID, Accession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['ALL', 'returned', 'active', 'overdue', 'renewed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Records' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">TX ID</th>
                <th className="px-4 py-3 font-semibold">Book & Accession</th>
                <th className="px-4 py-3 font-semibold">Borrower (Roll No)</th>
                <th className="px-4 py-3 font-semibold">Issue Date</th>
                <th className="px-4 py-3 font-semibold">Due / Return Date</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold">Fine & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecords.map((rec) => {
                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-300">
                      {rec.transactionId}
                      <div className="text-[10px] text-slate-500 font-normal">Copy: {rec.copyId}</div>
                    </td>

                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="font-bold text-slate-200 line-clamp-1" title={rec.bookTitle}>
                        {rec.bookTitle}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">{rec.accessionNo}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{rec.borrowerName}</div>
                      <div className="text-[10px] text-amber-300 font-mono">{rec.borrowerRollNo}</div>
                      <div className="text-[10px] text-slate-400">{rec.borrowerYearSection || rec.borrowerDepartment}</div>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400">{rec.issueDate}</td>

                    <td className="px-4 py-3 font-mono">
                      <div className="text-slate-300">Due: {rec.dueDate}</div>
                      {rec.returnDate && (
                        <div className="text-emerald-400 text-[11px] font-semibold">
                          Ret: {rec.returnDate}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {rec.status === 'returned' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                          <CheckCircle2 className="w-3 h-3" /> Returned
                        </span>
                      )}
                      {rec.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/60">
                          Active Checkout
                        </span>
                      )}
                      {rec.status === 'overdue' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-700/60">
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                      {rec.status === 'renewed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-700/60">
                          <RefreshCw className="w-2.5 h-2.5" /> Renewed
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {rec.fineAmount > 0 ? (
                        <div>
                          <span className={`font-bold ${rec.finePaid ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ₹{rec.fineAmount} ({rec.finePaid ? 'Paid' : 'Unpaid'})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">No fine</span>
                      )}
                      {rec.remarks && <div className="text-[10px] text-slate-400 line-clamp-1 italic">{rec.remarks}</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

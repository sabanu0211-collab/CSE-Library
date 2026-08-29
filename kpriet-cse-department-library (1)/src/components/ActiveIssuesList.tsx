import React, { useState, useMemo } from 'react';
import { RotateCcw, AlertTriangle, CheckCircle, Clock, Search, Filter, Printer, User, Phone, Mail, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { IssueRecord } from '../types';
import { calculateOverdueInfo } from '../services/storageService';

interface ActiveIssuesListProps {
  issues: IssueRecord[];
  onOpenReturnModal: (issue: IssueRecord) => void;
  onRenewIssue: (issue: IssueRecord) => void;
  onPrintSlip: (issue: IssueRecord) => void;
  onOpenIssueModal: () => void;
}

export const ActiveIssuesList: React.FC<ActiveIssuesListProps> = ({
  issues,
  onOpenReturnModal,
  onRenewIssue,
  onPrintSlip,
  onOpenIssueModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'OVERDUE' | 'DUE_SOON' | 'STUDENTS' | 'FACULTY'>('ALL');

  // Filter only active, overdue, or renewed issues
  const activeIssues = useMemo(() => {
    return issues.filter((i) => i.status === 'active' || i.status === 'overdue' || i.status === 'renewed');
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return activeIssues.filter((issue) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        issue.borrowerRollNo.toLowerCase().includes(query) ||
        issue.borrowerName.toLowerCase().includes(query) ||
        issue.bookTitle.toLowerCase().includes(query) ||
        issue.accessionNo.toLowerCase().includes(query) ||
        issue.copyId.toLowerCase().includes(query) ||
        issue.transactionId.toLowerCase().includes(query);

      const overdueInfo = calculateOverdueInfo(issue.dueDate);
      const isOverdue = overdueInfo.isOverdue;

      // Due soon: within 3 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(issue.dueDate);
      due.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

      let matchesFilter = true;
      if (filterType === 'OVERDUE') matchesFilter = isOverdue;
      else if (filterType === 'DUE_SOON') matchesFilter = isDueSoon;
      else if (filterType === 'STUDENTS') matchesFilter = issue.borrowerType === 'student';
      else if (filterType === 'FACULTY') matchesFilter = issue.borrowerType === 'faculty' || issue.borrowerType === 'researcher';

      return matchesSearch && matchesFilter;
    });
  }, [activeIssues, searchTerm, filterType]);

  const overdueCount = useMemo(() => {
    return activeIssues.filter((i) => calculateOverdueInfo(i.dueDate).isOverdue).length;
  }, [activeIssues]);

  const totalOutstandingFine = useMemo(() => {
    return activeIssues.reduce((sum, i) => sum + calculateOverdueInfo(i.dueDate).fine, 0);
  }, [activeIssues]);

  return (
    <div className="space-y-6">
      {/* Control Header & Metrics */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-500" />
              Active Issued Books & Circulation Desk
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live tracking of borrowed books, return schedules, renewal requests, and fine calculations.
            </p>
          </div>

          <button
            onClick={onOpenIssueModal}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Issue New Book</span>
          </button>
        </div>

        {/* Quick Overdue Alert Banner if overdue items exist */}
        {overdueCount > 0 && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg flex items-center justify-between text-xs text-rose-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
              <span>
                <strong>{overdueCount} book(s)</strong> are currently overdue. Total accrued penalty:{' '}
                <strong className="text-rose-300">₹{totalOutstandingFine}</strong> (@ ₹2/day).
              </span>
            </div>
            <button
              onClick={() => setFilterType('OVERDUE')}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium text-[11px] whitespace-nowrap"
            >
              Filter Overdue
            </button>
          </div>
        )}

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-issues-input"
              type="text"
              placeholder="Search by Student Roll No (e.g. 711122104042), Name, Book Title, Accession..."
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === 'ALL'
                  ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All Active ({activeIssues.length})
            </button>

            <button
              onClick={() => setFilterType('OVERDUE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                filterType === 'OVERDUE'
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-700 font-semibold'
                  : 'bg-slate-950 text-rose-400 border border-slate-800 hover:bg-rose-950/30'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Overdue ({overdueCount})</span>
            </button>

            <button
              onClick={() => setFilterType('DUE_SOON')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === 'DUE_SOON'
                  ? 'bg-amber-900/50 text-amber-300 border border-amber-700 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Due in ≤ 3 Days
            </button>

            <button
              onClick={() => setFilterType('STUDENTS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === 'STUDENTS'
                  ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Students
            </button>

            <button
              onClick={() => setFilterType('FACULTY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === 'FACULTY'
                  ? 'bg-slate-800 text-white border border-slate-700 font-semibold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Faculty / Staff
            </button>
          </div>
        </div>
      </div>

      {/* No issues matching */}
      {filteredIssues.length === 0 && (
        <div className="text-center py-14 bg-slate-900/50 rounded-xl border border-slate-800 p-6">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
          <h3 className="text-base font-bold text-slate-200">No active issue records matching criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            All books are either returned or no active records matched your search query.
          </p>
        </div>
      )}

      {/* Issues Table */}
      {filteredIssues.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">TX / Copy ID</th>
                  <th className="px-4 py-3 font-semibold">Book Title</th>
                  <th className="px-4 py-3 font-semibold">Borrower Info</th>
                  <th className="px-4 py-3 font-semibold">Issue Date</th>
                  <th className="px-4 py-3 font-semibold">Due Schedule</th>
                  <th className="px-4 py-3 font-semibold">Fine Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Circulation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredIssues.map((issue) => {
                  const overdueInfo = calculateOverdueInfo(issue.dueDate);
                  const isOverdue = overdueInfo.isOverdue;

                  // Days calculation
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const due = new Date(issue.dueDate);
                  due.setHours(0, 0, 0, 0);
                  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <tr
                      key={issue.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isOverdue ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      {/* TX / Copy */}
                      <td className="px-4 py-3.5 font-mono">
                        <div className="font-semibold text-slate-200">{issue.transactionId}</div>
                        <div className="text-[10px] text-amber-400">Copy: {issue.copyId}</div>
                        <div className="text-[10px] text-slate-500">{issue.accessionNo}</div>
                      </td>

                      {/* Book Title */}
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <div className="font-bold text-slate-100 line-clamp-1" title={issue.bookTitle}>
                          {issue.bookTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{issue.bookAuthor}</div>
                        {issue.renewalCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 mt-0.5">
                            <RefreshCw className="w-2.5 h-2.5" /> Renewed ({issue.renewalCount}x)
                          </span>
                        )}
                      </td>

                      {/* Borrower Info */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{issue.borrowerName}</span>
                        </div>
                        <div className="text-[11px] font-mono text-amber-400 pl-5">{issue.borrowerRollNo}</div>
                        <div className="text-[10px] text-slate-400 pl-5">
                          {issue.borrowerYearSection || issue.borrowerDepartment}
                        </div>
                      </td>

                      {/* Issue Date */}
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        <div>{issue.issueDate}</div>
                        <div className="text-[10px] text-slate-500">By: {issue.issuedBy}</div>
                      </td>

                      {/* Due Schedule */}
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-semibold text-slate-200">{issue.dueDate}</div>
                        {isOverdue ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/80 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{overdueInfo.daysOverdue} Days Overdue</span>
                          </div>
                        ) : diffDays === 0 ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>Due Today!</span>
                          </div>
                        ) : diffDays <= 3 ? (
                          <div className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded mt-1">
                            <Clock className="w-3 h-3" />
                            <span>Due in {diffDays} days</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-400 mt-0.5">
                            {diffDays} days remaining
                          </div>
                        )}
                      </td>

                      {/* Fine status */}
                      <td className="px-4 py-3.5 font-mono">
                        {isOverdue ? (
                          <div>
                            <span className="text-rose-400 font-bold text-sm">₹{overdueInfo.fine}</span>
                            <div className="text-[10px] text-rose-300/80">Pending Return</div>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">₹0.00</span>
                        )}
                      </td>

                      {/* Circulation Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Slip */}
                          <button
                            id={`btn-slip-${issue.id}`}
                            onClick={() => onPrintSlip(issue)}
                            title="View & Print Issue Slip"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Renew Button */}
                          <button
                            id={`btn-renew-${issue.id}`}
                            onClick={() => onRenewIssue(issue)}
                            title="Renew for +14 days"
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded text-[11px] font-medium border border-slate-700 transition-all active:scale-95 flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Renew</span>
                          </button>

                          {/* Return Button */}
                          <button
                            id={`btn-return-${issue.id}`}
                            onClick={() => onOpenReturnModal(issue)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span>Return</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

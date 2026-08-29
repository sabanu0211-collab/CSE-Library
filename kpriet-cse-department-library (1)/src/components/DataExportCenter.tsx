import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Database,
  Users,
  CheckCircle2,
  BookOpen,
  Calendar,
  AlertCircle,
  FileJson,
  ShieldCheck,
  RefreshCw,
  HardDrive,
  Copy,
} from 'lucide-react';
import { Book, IssueRecord, ReservationRecord, LibraryStats } from '../types';
import { StorageService } from '../services/storageService';

interface DataExportCenterProps {
  books: Book[];
  issues: IssueRecord[];
  reservations: ReservationRecord[];
  stats: LibraryStats;
  onRefreshData: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const DataExportCenter: React.FC<DataExportCenterProps> = ({
  books,
  issues,
  reservations,
  stats,
  onRefreshData,
  onShowToast,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const activeIssues = issues.filter(
    (i) => i.status === 'active' || i.status === 'overdue' || i.status === 'renewed'
  );

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCatalogCsv = () => {
    const csv = StorageService.exportBooksToCSV(books);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(csv, `KPRIET_CSE_Book_Catalog_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    onShowToast(`Exported ${books.length} catalog book titles to CSV.`, 'success');
  };

  const handleExportCirculationCsv = () => {
    const csv = StorageService.exportToCSV(issues);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(csv, `KPRIET_CSE_Circulation_Records_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    onShowToast(`Exported ${issues.length} circulation transaction records to CSV.`, 'success');
  };

  const handleExportActiveBorrowersCsv = () => {
    const headers = [
      'Roll Number',
      'Borrower Name',
      'Type',
      'Year / Section',
      'Email',
      'Active Books Count',
      'Book Titles',
      'Overdue Status',
    ];
    
    // Group active issues by borrower
    const borrowerMap = new Map<string, {
      rollNo: string;
      name: string;
      type: string;
      section: string;
      email: string;
      books: string[];
      hasOverdue: boolean;
    }>();

    activeIssues.forEach((issue) => {
      const existing = borrowerMap.get(issue.borrowerRollNo);
      if (existing) {
        existing.books.push(issue.bookTitle);
        if (issue.status === 'overdue') existing.hasOverdue = true;
      } else {
        borrowerMap.set(issue.borrowerRollNo, {
          rollNo: issue.borrowerRollNo,
          name: issue.borrowerName,
          type: issue.borrowerType,
          section: issue.borrowerYearSection || issue.borrowerDepartment,
          email: issue.borrowerEmail,
          books: [issue.bookTitle],
          hasOverdue: issue.status === 'overdue',
        });
      }
    });

    const rows = Array.from(borrowerMap.values()).map((b) => [
      `"${b.rollNo}"`,
      `"${b.name}"`,
      `"${b.type}"`,
      `"${b.section}"`,
      `"${b.email}"`,
      b.books.length,
      `"${b.books.join('; ').replace(/"/g, '""')}"`,
      b.hasOverdue ? 'YES (OVERDUE)' : 'NO',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(csv, `KPRIET_CSE_Active_Borrowers_${dateStr}.csv`, 'text/csv;charset=utf-8;');
    onShowToast(`Exported ${borrowerMap.size} active borrower records to CSV.`, 'success');
  };

  const handleExportFullJsonBackup = () => {
    const json = StorageService.exportAllDataJSON();
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(json, `KPRIET_CSE_Library_Backup_${dateStr}.json`, 'application/json');
    onShowToast('Exported complete department library database backup (JSON).', 'success');
  };

  const copySummaryToClipboard = () => {
    const text = `KPRIET CSE Department Library Summary Report
Date: ${new Date().toLocaleDateString()}
Total Book Titles: ${stats.totalTitles} (${stats.totalCopies} physical copies)
Available Shelf Stock: ${stats.availableCopies} copies
Currently Issued: ${stats.issuedCopies} books
Overdue Issues: ${stats.overdueCount}
Active Student Borrowers: ${stats.activeBorrowersCount}
Total Fines Collected: ₹${stats.totalFinesCollected}
Pending Reservations: ${stats.pendingReservations}
Department: Computer Science and Engineering, KPRIET, Coimbatore`;

    navigator.clipboard.writeText(text);
    setCopiedType('summary');
    setTimeout(() => setCopiedType(null), 3000);
    onShowToast('Summary report copied to clipboard!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-950/40">
            <Database className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Department Data & Export Center
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Librarian Access
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Download real-time spreadsheets, circulation records, borrower audits, and complete database backups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copySummaryToClipboard}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            {copiedType === 'summary' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Summary Report</span>
              </>
            )}
          </button>
          <button
            onClick={onRefreshData}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-all"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Live Data Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Registered Titles</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">
            {stats.totalTitles}{' '}
            <span className="text-xs font-normal text-slate-400">({stats.totalCopies} copies)</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {stats.availableCopies} available on shelf
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Active Borrowers</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{stats.activeBorrowersCount}</div>
          <div className="text-[11px] text-blue-300 mt-1">{stats.issuedCopies} books currently on loan</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rose-400" />
            <span>Overdue Records</span>
          </div>
          <div className={`text-2xl font-bold mt-1 ${stats.overdueCount > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
            {stats.overdueCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">₹{stats.totalFinesCollected} fines collected</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-xs flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Total Transactions</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-1">{issues.length}</div>
          <div className="text-[11px] text-purple-300 mt-1">{reservations.length} total hold reservations</div>
        </div>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Book Catalog CSV */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Complete Catalog Spreadsheet (CSV)</h3>
                <p className="text-xs text-slate-400">All registered book titles, authors, ISBNs, racks & stock</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              {books.length} rows
            </span>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-300 font-semibold">Included Columns:</div>
            <p className="text-[11px] text-slate-400">
              Accession No, Title, Author, Subject Code, Category, Semester, Publisher, Edition, ISBN, Total Copies, Available Copies, Rack ID, Rack Location, Shelf Number.
            </p>
          </div>

          <button
            id="btn-download-catalog-csv"
            onClick={handleExportCatalogCsv}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Download Catalog CSV (.csv)</span>
          </button>
        </div>

        {/* Card 2: Circulation Records CSV */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Circulation & Issue History (CSV)</h3>
                <p className="text-xs text-slate-400">All historical loan transactions, student roll numbers & returns</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              {issues.length} rows
            </span>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-300 font-semibold">Included Columns:</div>
            <p className="text-[11px] text-slate-400">
              Transaction ID, Book Title, Accession No, Copy Barcode, Borrower Name, Roll Number, Issue Date, Due Date, Return Date, Status, Overdue Fine, Fine Paid Status.
            </p>
          </div>

          <button
            id="btn-download-circulation-csv"
            onClick={handleExportCirculationCsv}
            className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Download Circulation History CSV (.csv)</span>
          </button>
        </div>

        {/* Card 3: Active Borrowers Audit */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Active Borrowers List (CSV)</h3>
                <p className="text-xs text-slate-400">Current students with active books in possession</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              {stats.activeBorrowersCount} students
            </span>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-300 font-semibold">Included Columns:</div>
            <p className="text-[11px] text-slate-400">
              Student Roll No, Name, Class/Section, Email, Borrowed Book Titles, and Overdue Alert Flag for immediate classroom follow-up.
            </p>
          </div>

          <button
            id="btn-download-borrowers-csv"
            onClick={handleExportActiveBorrowersCsv}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Download Active Borrowers CSV (.csv)</span>
          </button>
        </div>

        {/* Card 4: Full System JSON Backup */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Complete Database Backup (JSON)</h3>
                <p className="text-xs text-slate-400">Full structured snapshot of books, issues, reservations & metadata</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
              Full Archive
            </span>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-300 font-semibold">Usage:</div>
            <p className="text-[11px] text-slate-400">
              Safe offline archival copy for compliance, semester handover, or restoring data to another system.
            </p>
          </div>

          <button
            id="btn-download-json-backup"
            onClick={handleExportFullJsonBackup}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Backup (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

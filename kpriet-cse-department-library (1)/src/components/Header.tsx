import React from 'react';
import {
  BookOpen,
  PlusCircle,
  RotateCcw,
  Sparkles,
  MapPin,
  Download,
  Library,
  Lock,
  LogOut,
  ShieldCheck,
  FileSpreadsheet,
  GraduationCap,
  Database,
} from 'lucide-react';
import { LibraryStats } from '../types';

interface HeaderProps {
  stats: LibraryStats;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  onOpenIssueModal: () => void;
  onOpenAddBookModal: () => void;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  activeTab,
  setActiveTab,
  isAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  onOpenIssueModal,
  onOpenAddBookModal,
  onExportCsv,
}) => {
  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top institutional strip */}
      <div className="bg-slate-950/90 px-4 py-1.5 border-b border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">KPR Institute of Engineering and Technology</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-medium">Department of Computer Science & Engineering</span>
          <span className="text-slate-500">|</span>
          <span>Block II (Newton Block, CS-204)</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {isAdmin ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Librarian Admin Mode</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-950/80 text-purple-300 border border-purple-800/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Librarian & Syllabus Advisor</span>
            </span>
          )}
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">Academic Year 2026-2027</span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/30 text-white flex-shrink-0">
              {isAdmin ? <Library className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {isAdmin ? 'CSE Department Library Console' : 'KPRIET CSE AI Librarian'}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Admin / Librarian
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {isAdmin
                  ? 'Manage Books, Excel Imports, Issue & Returns Desk, Circulation Records & Data Exports'
                  : 'Syllabus Curriculum Assistant & Real-Time Physical Shelf Locator • Block II (CS-204)'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin ? (
              <>
                <button
                  id="btn-upload-excel-books"
                  onClick={onOpenAddBookModal}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Upload Excel / Add Book</span>
                </button>

                <button
                  id="btn-quick-issue"
                  onClick={onOpenIssueModal}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Issue Book</span>
                </button>

                <button
                  id="btn-export-csv"
                  onClick={onExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
                  title="Export issue records to CSV"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  id="btn-admin-logout"
                  onClick={onAdminLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
                  title="Sign out of Admin Mode and switch back to AI Librarian Chatbot"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit Admin</span>
                </button>
              </>
            ) : (
              /* Public / Student Front View: Prominent Librarian Login button */
              <button
                id="btn-admin-login"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-950/40 active:scale-95 border border-amber-400"
              >
                <Lock className="w-4 h-4" />
                <span>Librarian / Staff Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics & Navigation - DISPLAYED ONLY FOR ADMIN */}
        {isAdmin && (
          <>
            {/* Live Metrics Row for Admin */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mt-4 pt-3 border-t border-slate-800/80">
              <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Total Titles</div>
                <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {stats.totalTitles}{' '}
                  <span className="text-xs font-normal text-slate-400">({stats.totalCopies} copies)</span>
                </div>
              </div>

              <div className="bg-emerald-950/40 rounded-lg p-2.5 border border-emerald-800/40">
                <div className="text-[11px] text-emerald-400 uppercase tracking-wider font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Available Now
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-300 mt-0.5">
                  {stats.availableCopies} <span className="text-xs font-normal text-emerald-400/70">on shelf</span>
                </div>
              </div>

              <div className="bg-blue-950/40 rounded-lg p-2.5 border border-blue-800/40">
                <div className="text-[11px] text-blue-400 uppercase tracking-wider font-medium">Issued Out</div>
                <div className="text-lg sm:text-xl font-bold text-blue-300 mt-0.5">
                  {stats.issuedCopies} <span className="text-xs font-normal text-blue-400/70">books</span>
                </div>
              </div>

              <div
                className={`rounded-lg p-2.5 border ${
                  stats.overdueCount > 0
                    ? 'bg-rose-950/50 border-rose-800/60 text-rose-200'
                    : 'bg-slate-800/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider font-medium flex items-center justify-between">
                  <span>Overdue</span>
                  {stats.overdueCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                      Action
                    </span>
                  )}
                </div>
                <div
                  className={`text-lg sm:text-xl font-bold mt-0.5 ${
                    stats.overdueCount > 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {stats.overdueCount} <span className="text-xs font-normal text-rose-400/80">records</span>
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Active Borrowers</div>
                <div className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {stats.activeBorrowersCount} <span className="text-xs font-normal text-slate-400">students</span>
                </div>
              </div>

              <div className="bg-purple-950/30 rounded-lg p-2.5 border border-purple-800/30">
                <div className="text-[11px] text-purple-300 uppercase tracking-wider font-medium">Data Exports</div>
                <div className="text-sm font-bold text-purple-200 mt-1 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ready (.csv)</span>
                </div>
              </div>
            </div>

            {/* Admin Management Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-sm">
              <button
                id="tab-catalog"
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeTab === 'catalog'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Book Catalog & Stock</span>
                <span className="px-1.5 py-0.2 rounded-md text-[10px] bg-slate-950/60 text-slate-200 font-mono">
                  {stats.availableCopies}/{stats.totalCopies}
                </span>
              </button>

              <button
                id="tab-issued"
                onClick={() => setActiveTab('issued')}
                className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeTab === 'issued'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Active Issues & Returns</span>
                {stats.overdueCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                    {stats.overdueCount}
                  </span>
                )}
              </button>

              <button
                id="tab-history"
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
              >
                <Library className="w-4 h-4" />
                <span>Circulation Records</span>
              </button>

              <button
                id="tab-racks"
                onClick={() => setActiveTab('racks')}
                className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeTab === 'racks'
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Shelf & Rack Map</span>
              </button>

              <button
                id="tab-data-center"
                onClick={() => setActiveTab('data-center')}
                className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeTab === 'data-center'
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm'
                    : 'text-emerald-300 hover:text-white hover:bg-slate-800 border-transparent'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Data & Export Center</span>
              </button>

              <button
                id="tab-ai-helper"
                onClick={() => setActiveTab('ai-helper')}
                className={`px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeTab === 'ai-helper'
                    ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-sm'
                    : 'text-purple-300 hover:text-purple-100 hover:bg-purple-900/30 border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>AI Librarian Chatbot</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

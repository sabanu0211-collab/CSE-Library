/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StorageService } from './services/storageService';
import { Book, IssueRecord, ReservationRecord, LibraryStats } from './types';
import { Header } from './components/Header';
import { BookCatalog } from './components/BookCatalog';
import { ActiveIssuesList } from './components/ActiveIssuesList';
import { TransactionHistory } from './components/TransactionHistory';
import { RackVisualizer } from './components/RackVisualizer';
import { AiAssistant } from './components/AiAssistant';
import { DataExportCenter } from './components/DataExportCenter';
import { BookDetailModal } from './components/BookDetailModal';
import { IssueBookModal } from './components/IssueBookModal';
import { ReturnRenewModal } from './components/ReturnRenewModal';
import { IssueSlipModal } from './components/IssueSlipModal';
import { AddBookModal } from './components/AddBookModal';
import { ReservationModal } from './components/ReservationModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CheckCircle2, AlertCircle, Sparkles, BookOpen, Layers, ShieldCheck, Lock, Database } from 'lucide-react';

export default function App() {
  // Core state
  const [books, setBooks] = useState<Book[]>([]);
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [stats, setStats] = useState<LibraryStats>({
    totalTitles: 0,
    totalCopies: 0,
    availableCopies: 0,
    issuedCopies: 0,
    overdueCount: 0,
    activeBorrowersCount: 0,
    totalFinesCollected: 0,
    pendingReservations: 0,
  });

  // Role Authentication: Public Front View (AI Librarian only) by default, Admin Mode with login
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Active tab in Admin Mode: 'catalog' | 'issued' | 'history' | 'racks' | 'data-center' | 'ai-helper'
  const [activeTab, setActiveTab] = useState<string>('catalog');

  // Modals state
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [preSelectedBookForIssue, setPreSelectedBookForIssue] = useState<Book | null>(null);
  const [returnModalIssue, setReturnModalIssue] = useState<IssueRecord | null>(null);
  const [slipModalIssue, setSlipModalIssue] = useState<IssueRecord | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [reserveModalBook, setReserveModalBook] = useState<Book | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Sync and refresh all state from storage
  const refreshData = useCallback(() => {
    const loadedBooks = StorageService.getBooks();
    const loadedIssues = StorageService.getIssues();
    const loadedReservations = StorageService.getReservations();
    const computedStats = StorageService.getStats();

    setBooks(loadedBooks);
    setIssues(loadedIssues);
    setReservations(loadedReservations);
    setStats(computedStats);

    // If detail modal is open, refresh the book instance
    if (selectedBookForDetail) {
      const updated = loadedBooks.find((b) => b.id === selectedBookForDetail.id);
      if (updated) setSelectedBookForDetail(updated);
    }
  }, [selectedBookForDetail]);

  useEffect(() => {
    refreshData();
  }, []);

  // Safe tab switcher
  const handleTabChange = (tab: string) => {
    if (!isAdmin) {
      setIsAdminLoginModalOpen(true);
      showToast('Librarian / Staff login is required to access management options and data records.', 'info');
      return;
    }
    setActiveTab(tab);
  };

  // Handle Book Issue (Admin only)
  const handleIssueSuccess = (issueParams: any) => {
    const res = StorageService.issueBook(issueParams);
    if (res.success && res.issueRecord) {
      refreshData();
      setIsIssueModalOpen(false);
      setPreSelectedBookForIssue(null);
      showToast(`Book successfully issued to ${issueParams.borrowerName} (${issueParams.borrowerRollNo})!`, 'success');
      // Automatically open printable slip
      setSlipModalIssue(res.issueRecord);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Book Return (Admin only)
  const handleReturnSuccess = (returnParams: any) => {
    const res = StorageService.returnBook(returnParams);
    if (res.success) {
      refreshData();
      setReturnModalIssue(null);
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Book Renewal (Admin only)
  const handleRenewIssue = (issue: IssueRecord) => {
    const res = StorageService.renewBook(issue.id, 14);
    if (res.success) {
      refreshData();
      showToast(`Renewed "${issue.bookTitle}" for ${issue.borrowerName} until ${res.newDueDate}!`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Add New Book (Admin only)
  const handleAddBookSuccess = (bookData: any) => {
    const newBook = StorageService.addBook(bookData);
    refreshData();
    setIsAddBookModalOpen(false);
    showToast(`Added new title: "${newBook.title}" with ${newBook.totalCopies} copies to ${newBook.rackLocation}!`, 'success');
  };

  // Handle Add Multiple Books from Excel or batch (Admin only)
  const handleAddMultipleBooksSuccess = (booksData: any[]) => {
    const newBooks = StorageService.addMultipleBooks(booksData);
    refreshData();
    setIsAddBookModalOpen(false);
    const totalAddedCopies = newBooks.reduce((acc, b) => acc + b.totalCopies, 0);
    showToast(`Successfully registered ${newBooks.length} book titles (${totalAddedCopies} physical copies) from Excel into CSE Catalog!`, 'success');
  };

  // Handle Student / User Reservation
  const handleReserveSuccess = (bookId: string, studentData: any) => {
    const res = StorageService.reserveBook(bookId, studentData);
    if (res.success) {
      refreshData();
      setReserveModalBook(null);
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Handle Export CSV (Admin only)
  const handleExportCsv = () => {
    if (!isAdmin) {
      setIsAdminLoginModalOpen(true);
      return;
    }
    const allIssues = StorageService.getIssues();
    const csvContent = StorageService.exportToCSV(allIssues);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kpriet-cse-circulation-records-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Library circulation records exported to CSV successfully.', 'info');
  };

  // Handle Reset to Defaults (Admin only)
  const handleResetDefaults = () => {
    StorageService.resetDefaults();
    refreshData();
    showToast('Reset library database to KPRIET CSE Department default state.', 'info');
  };

  // Admin login success handler
  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setActiveTab('catalog'); // Navigate to catalog on login
    showToast('Authenticated as CSE Librarian. Admin Console & Management Data Unlocked.', 'success');
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsAdmin(false);
    showToast('Signed out of Librarian Mode. Switched to Public AI Librarian View.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700 shadow-emerald-950/50'
                : toastMessage.type === 'error'
                ? 'bg-rose-950 text-rose-200 border-rose-700 shadow-rose-950/50'
                : 'bg-slate-900 text-slate-200 border-slate-700 shadow-slate-950/50'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Header with Role Toggle and Actions */}
      <Header
        stats={stats}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        onOpenIssueModal={() => {
          if (!isAdmin) {
            setIsAdminLoginModalOpen(true);
            return;
          }
          setPreSelectedBookForIssue(null);
          setIsIssueModalOpen(true);
        }}
        onOpenAddBookModal={() => {
          if (!isAdmin) {
            setIsAdminLoginModalOpen(true);
            return;
          }
          setIsAddBookModalOpen(true);
        }}
        onExportCsv={handleExportCsv}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ========================================================= */}
        {/* PUBLIC FRONT UI: ONLY AI LIBRARIAN CHATBOT IS DISPLAYED  */}
        {/* ========================================================= */}
        {!isAdmin ? (
          <AiAssistant
            books={books}
            isAdmin={false}
            onSelectBookByTitle={(title) => {
              const b = books.find((x) => x.title.toLowerCase().includes(title.toLowerCase()));
              if (b) setSelectedBookForDetail(b);
            }}
          />
        ) : (
          /* ========================================================= */
          /* ADMIN / LIBRARIAN CONSOLE: ALL MANAGEMENT & DATA OPTIONS   */
          /* ========================================================= */
          <>
            {/* Tab 1: Book Catalog & Stock */}
            {activeTab === 'catalog' && (
              <BookCatalog
                books={books}
                isAdmin={true}
                onSelectBook={(book) => setSelectedBookForDetail(book)}
                onIssueBook={(book) => {
                  setPreSelectedBookForIssue(book);
                  setIsIssueModalOpen(true);
                }}
                onReserveBook={(book) => setReserveModalBook(book)}
                onOpenAdminLogin={() => {}}
              />
            )}

            {/* Tab 2: Active Issues & Returns Desk */}
            {activeTab === 'issued' && (
              <ActiveIssuesList
                issues={issues}
                onOpenReturnModal={(issue) => setReturnModalIssue(issue)}
                onRenewIssue={handleRenewIssue}
                onPrintSlip={(issue) => setSlipModalIssue(issue)}
                onOpenIssueModal={() => {
                  setPreSelectedBookForIssue(null);
                  setIsIssueModalOpen(true);
                }}
              />
            )}

            {/* Tab 3: Complete Transaction Records & History */}
            {activeTab === 'history' && (
              <TransactionHistory
                issues={issues}
                onExportCsv={handleExportCsv}
                onResetDefaults={handleResetDefaults}
              />
            )}

            {/* Tab 4: Shelf & Rack 2D Floor Plan Visualizer */}
            {activeTab === 'racks' && (
              <RackVisualizer
                books={books}
                onSelectBook={(book) => setSelectedBookForDetail(book)}
                onIssueBook={(book) => {
                  setPreSelectedBookForIssue(book);
                  setIsIssueModalOpen(true);
                }}
              />
            )}

            {/* Tab 5: Department Data & Export Center */}
            {activeTab === 'data-center' && (
              <DataExportCenter
                books={books}
                issues={issues}
                reservations={reservations}
                stats={stats}
                onRefreshData={refreshData}
                onShowToast={showToast}
              />
            )}

            {/* Tab 6: AI Librarian Chatbot (Librarian View) */}
            {activeTab === 'ai-helper' && (
              <AiAssistant
                books={books}
                isAdmin={true}
                onSelectBookByTitle={(title) => {
                  const b = books.find((x) => x.title.toLowerCase().includes(title.toLowerCase()));
                  if (b) setSelectedBookForDetail(b);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-300">Department of Computer Science and Engineering</span>
            <span>•</span>
            <span>KPR Institute of Engineering and Technology</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Block II CS-204</span>
            <span>•</span>
            {!isAdmin ? (
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 underline font-medium"
              >
                Librarian / Staff Login
              </button>
            ) : (
              <span className="text-emerald-400 font-semibold">Librarian Management Active</span>
            )}
          </div>
        </div>
      </footer>

      {/* Modals Container */}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Book Detail Modal */}
      {selectedBookForDetail && (
        <BookDetailModal
          book={selectedBookForDetail}
          isAdmin={isAdmin}
          onClose={() => setSelectedBookForDetail(null)}
          onIssueCopy={(book, copyId) => {
            if (!isAdmin) {
              setSelectedBookForDetail(null);
              setIsAdminLoginModalOpen(true);
              return;
            }
            setSelectedBookForDetail(null);
            setPreSelectedBookForIssue(book);
            setIsIssueModalOpen(true);
          }}
          onReserveBook={(book) => {
            setSelectedBookForDetail(null);
            setReserveModalBook(book);
          }}
        />
      )}

      {/* Issue Book Modal (Admin only) */}
      {isIssueModalOpen && isAdmin && (
        <IssueBookModal
          books={books}
          preSelectedBook={preSelectedBookForIssue}
          onClose={() => {
            setIsIssueModalOpen(false);
            setPreSelectedBookForIssue(null);
          }}
          onIssueSuccess={handleIssueSuccess}
        />
      )}

      {/* Return Book Modal (Admin only) */}
      {returnModalIssue && isAdmin && (
        <ReturnRenewModal
          issue={returnModalIssue}
          onClose={() => setReturnModalIssue(null)}
          onConfirmReturn={handleReturnSuccess}
        />
      )}

      {/* Printable Issue Slip Modal */}
      {slipModalIssue && (
        <IssueSlipModal
          issue={slipModalIssue}
          onClose={() => setSlipModalIssue(null)}
        />
      )}

      {/* Excel Upload & Add Book Modal (Admin only) */}
      {isAddBookModalOpen && isAdmin && (
        <AddBookModal
          onClose={() => setIsAddBookModalOpen(false)}
          onAddBook={handleAddBookSuccess}
          onAddMultipleBooks={handleAddMultipleBooksSuccess}
        />
      )}

      {/* Reservation / Hold Modal (Students & Admin) */}
      {reserveModalBook && (
        <ReservationModal
          book={reserveModalBook}
          onClose={() => setReserveModalBook(null)}
          onConfirmReservation={handleReserveSuccess}
        />
      )}
    </div>
  );
}

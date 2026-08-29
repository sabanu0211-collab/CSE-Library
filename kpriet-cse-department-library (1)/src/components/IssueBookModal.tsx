import React, { useState } from 'react';
import { X, BookOpen, User, Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Book, BorrowerType } from '../types';

interface IssueBookModalProps {
  books: Book[];
  preSelectedBook?: Book | null;
  onClose: () => void;
  onIssueSuccess: (issueParams: any) => void;
}

export const IssueBookModal: React.FC<IssueBookModalProps> = ({
  books,
  preSelectedBook,
  onClose,
  onIssueSuccess,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>(
    preSelectedBook ? preSelectedBook.id : books.find((b) => b.availableCopies > 0)?.id || ''
  );
  const [selectedCopyId, setSelectedCopyId] = useState<string>('');

  const [borrowerType, setBorrowerType] = useState<BorrowerType>('student');
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerRollNo, setBorrowerRollNo] = useState('');
  const [borrowerDepartment, setBorrowerDepartment] = useState('CSE');
  const [borrowerYearSection, setBorrowerYearSection] = useState('III Year CSE-A');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('+91 ');
  const [loanPeriodDays, setLoanPeriodDays] = useState<number>(14);
  const [issuedBy, setIssuedBy] = useState('Librarian (Mrs. Karpagam)');
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentBook = books.find((b) => b.id === selectedBookId);
  const availableCopies = currentBook?.copies.filter((c) => c.isAvailable) || [];

  // Calculate issue date (today) and due date
  const todayStr = new Date().toISOString().split('T')[0];
  const calculatedDueDate = new Date();
  calculatedDueDate.setDate(calculatedDueDate.getDate() + loanPeriodDays);
  const dueDateStr = calculatedDueDate.toISOString().split('T')[0];

  // Quick fill sample KPRIET students / faculty
  const handleQuickFill = (type: 'student1' | 'student2' | 'faculty') => {
    if (type === 'student1') {
      setBorrowerType('student');
      setBorrowerName('Priyadharshini K');
      setBorrowerRollNo('711122104052');
      setBorrowerDepartment('CSE');
      setBorrowerYearSection('III Year CSE-B');
      setBorrowerEmail('priya.711122104052@kpriet.ac.in');
      setBorrowerPhone('+91 94421 88052');
      setLoanPeriodDays(14);
    } else if (type === 'student2') {
      setBorrowerType('student');
      setBorrowerName('Aravindhan M');
      setBorrowerRollNo('711123104008');
      setBorrowerDepartment('CSE');
      setBorrowerYearSection('II Year CSE-A');
      setBorrowerEmail('aravind.711123104008@kpriet.ac.in');
      setBorrowerPhone('+91 97890 22008');
      setLoanPeriodDays(14);
    } else {
      setBorrowerType('faculty');
      setBorrowerName('Dr. N. Yuvaraj (Professor & Head)');
      setBorrowerRollNo('FAC-CSE-001');
      setBorrowerDepartment('CSE');
      setBorrowerYearSection('Faculty - CSE');
      setBorrowerEmail('yuvaraj.n@kpriet.ac.in');
      setBorrowerPhone('+91 98422 11001');
      setLoanPeriodDays(30);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedBookId) {
      setErrorMsg('Please select a book to issue.');
      return;
    }
    if (!currentBook || currentBook.availableCopies <= 0) {
      setErrorMsg('Selected book has no available copies on shelf.');
      return;
    }
    if (!borrowerName.trim() || !borrowerRollNo.trim()) {
      setErrorMsg('Borrower Name and Roll/Faculty Number are required.');
      return;
    }

    onIssueSuccess({
      bookId: selectedBookId,
      copyId: selectedCopyId || availableCopies[0]?.copyId,
      borrowerName: borrowerName.trim(),
      borrowerRollNo: borrowerRollNo.trim(),
      borrowerType,
      borrowerDepartment,
      borrowerYearSection,
      borrowerEmail: borrowerEmail.trim() || `${borrowerRollNo.toLowerCase()}@kpriet.ac.in`,
      borrowerPhone: borrowerPhone.trim(),
      issueDate: todayStr,
      dueDate: dueDateStr,
      issuedBy,
      remarks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Issue Book to Student / Faculty</h3>
              <p className="text-xs text-slate-400">KPRIET CSE Department Library Circulation Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Fill Student Pills */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Autofill KPRIET User:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('student1')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px]"
            >
              Priyadharshini (III CSE)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('student2')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px]"
            >
              Aravindhan (II CSE)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('faculty')}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded text-[11px]"
            >
              Dr. Yuvaraj (HoD)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Book Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Select Book Title *</label>
            <select
              id="select-issue-book"
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                setSelectedCopyId('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 text-xs focus:ring-2 focus:ring-amber-500/50"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                  [{b.subjectCode}] {b.title} — {b.availableCopies > 0 ? `${b.availableCopies} available (${b.rackLocation})` : 'OUT OF STOCK'}
                </option>
              ))}
            </select>
          </div>

          {/* Book selected overview */}
          {currentBook && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-400">{currentBook.title}</div>
                <div className="text-slate-400 text-[11px]">
                  Author: {currentBook.author} • Accession: <span className="font-mono">{currentBook.accessionNo}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-semibold">
                  {currentBook.availableCopies} Copies on Shelf
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">{currentBook.rackLocation}</div>
              </div>
            </div>
          )}

          {/* Physical Copy Selection if multiple available */}
          {availableCopies.length > 1 && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Physical Barcode Copy</label>
              <select
                value={selectedCopyId}
                onChange={(e) => setSelectedCopyId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs"
              >
                {availableCopies.map((c) => (
                  <option key={c.copyId} value={c.copyId}>
                    Copy ID: {c.copyId} ({c.accessionNumber}) — Condition: {c.condition}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Borrower Type Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Borrower Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'faculty', 'researcher'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setBorrowerType(type);
                    setLoanPeriodDays(type === 'faculty' ? 30 : 14);
                  }}
                  className={`py-2 px-3 rounded-lg border text-center font-medium capitalize transition-all ${
                    borrowerType === type
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Borrower Fields (2 Column Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-slate-300">
                {borrowerType === 'student' ? 'Student Full Name *' : 'Faculty Name *'}
              </label>
              <input
                id="input-borrower-name"
                type="text"
                required
                placeholder="e.g. Naveen Kumar R"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">
                {borrowerType === 'student' ? 'Roll / Register Number *' : 'Faculty Staff ID *'}
              </label>
              <input
                id="input-borrower-roll"
                type="text"
                required
                placeholder="e.g. 711122104042 or 22CS105"
                value={borrowerRollNo}
                onChange={(e) => setBorrowerRollNo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Year / Section / Designation</label>
              <input
                type="text"
                placeholder="e.g. III Year CSE-A / Asst Professor"
                value={borrowerYearSection}
                onChange={(e) => setBorrowerYearSection(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Institutional Email</label>
              <input
                type="email"
                placeholder="e.g. name@kpriet.ac.in"
                value={borrowerEmail}
                onChange={(e) => setBorrowerEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Loan Period & Due Date Schedule */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300">Loan Duration Preset</label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setLoanPeriodDays(14)}
                  className={`px-2 py-0.5 rounded ${loanPeriodDays === 14 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  14 Days (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setLoanPeriodDays(21)}
                  className={`px-2 py-0.5 rounded ${loanPeriodDays === 21 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  21 Days (Exam Prep)
                </button>
                <button
                  type="button"
                  onClick={() => setLoanPeriodDays(30)}
                  className={`px-2 py-0.5 rounded ${loanPeriodDays === 30 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
                >
                  30 Days (Faculty)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <span className="text-slate-400">Issue Date (Today):</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{todayStr}</div>
              </div>
              <div>
                <span className="text-slate-400">Calculated Return Due Date:</span>
                <div className="font-mono font-bold text-amber-400 mt-0.5">{dueDateStr}</div>
              </div>
            </div>
          </div>

          {/* Librarian Staff selector & remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-slate-300">Issued By (Staff In-Charge)</label>
              <select
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs"
              >
                <option value="Librarian (Mrs. Karpagam)">Mrs. Karpagam (CSE Dept Librarian)</option>
                <option value="Prof. Anusuya N T (Staff In-Charge)">Prof. Anusuya N T (Library Coordinator)</option>
                <option value="Dr. Yuvaraj N (HoD CSE)">Dr. Yuvaraj N (HoD CSE)</option>
                <option value="Student Assistant">Student Library Assistant</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Special Remarks (Optional)</label>
              <input
                type="text"
                placeholder="e.g. For Anna University Lab Preparation"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-issue"
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Issue Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

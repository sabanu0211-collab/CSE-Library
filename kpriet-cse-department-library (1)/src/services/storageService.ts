import { Book, IssueRecord, ReservationRecord, LibraryStats } from '../types';
import { INITIAL_BOOKS, INITIAL_ISSUES, INITIAL_RESERVATIONS } from '../data/mockData';

const STORAGE_KEYS = {
  BOOKS: 'kpriet_cse_lib_books_v1',
  ISSUES: 'kpriet_cse_lib_issues_v1',
  RESERVATIONS: 'kpriet_cse_lib_reservations_v1',
};

// Helper: Calculate overdue days and fine amount (e.g., Rs 2 per day)
export function calculateOverdueInfo(dueDateStr: string): { isOverdue: boolean; daysOverdue: number; fine: number } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      isOverdue: true,
      daysOverdue: diffDays,
      fine: diffDays * 2, // Rs 2 per day fine as per KPRIET standard
    };
  }

  return { isOverdue: false, daysOverdue: 0, fine: 0 };
}

export const StorageService = {
  getBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
        return INITIAL_BOOKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKS;
    }
  },

  saveBooks(books: Book[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage', e);
    }
  },

  getIssues(): IssueRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
      let issues: IssueRecord[];
      if (!data) {
        issues = INITIAL_ISSUES;
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
      } else {
        issues = JSON.parse(data);
      }

      // Dynamically sync overdue status and fine calculations for active issues
      return issues.map((rec) => {
        if (rec.status === 'active' || rec.status === 'overdue' || rec.status === 'renewed') {
          const { isOverdue, fine } = calculateOverdueInfo(rec.dueDate);
          if (isOverdue) {
            return {
              ...rec,
              status: 'overdue',
              fineAmount: fine,
            };
          }
        }
        return rec;
      });
    } catch {
      return INITIAL_ISSUES;
    }
  },

  saveIssues(issues: IssueRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch (e) {
      console.error('Failed to save issues to localStorage', e);
    }
  },

  getReservations(): ReservationRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
        return INITIAL_RESERVATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_RESERVATIONS;
    }
  },

  saveReservations(reservations: ReservationRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error('Failed to save reservations to localStorage', e);
    }
  },

  issueBook(params: {
    bookId: string;
    copyId?: string;
    borrowerName: string;
    borrowerRollNo: string;
    borrowerType: 'student' | 'faculty' | 'researcher';
    borrowerDepartment: string;
    borrowerYearSection: string;
    borrowerEmail: string;
    borrowerPhone: string;
    issueDate: string;
    dueDate: string;
    issuedBy: string;
    remarks?: string;
  }): { success: boolean; issueRecord?: IssueRecord; message: string } {
    const books = this.getBooks();
    const bookIndex = books.findIndex((b) => b.id === params.bookId);

    if (bookIndex === -1) {
      return { success: false, message: 'Book not found in CSE library catalog.' };
    }

    const book = books[bookIndex];
    if (book.availableCopies <= 0) {
      return { success: false, message: 'No copies currently available on shelf.' };
    }

    // Pick specific copy or first available copy
    let selectedCopy = book.copies.find((c) => (params.copyId ? c.copyId === params.copyId : c.isAvailable));

    if (!selectedCopy || !selectedCopy.isAvailable) {
      selectedCopy = book.copies.find((c) => c.isAvailable);
    }

    if (!selectedCopy) {
      return { success: false, message: 'No available copy found for checkout.' };
    }

    // Update copy and book availability
    selectedCopy.isAvailable = false;
    selectedCopy.issuedTo = {
      rollNo: params.borrowerRollNo,
      name: params.borrowerName,
      dueDate: params.dueDate,
      issueDate: params.issueDate,
    };
    book.availableCopies = Math.max(0, book.availableCopies - 1);

    this.saveBooks(books);

    // Create Issue Record
    const txId = `TX-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newRecord: IssueRecord = {
      id: `issue-${Date.now()}`,
      transactionId: txId,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      accessionNo: book.accessionNo,
      copyId: selectedCopy.copyId,
      borrowerName: params.borrowerName,
      borrowerRollNo: params.borrowerRollNo,
      borrowerType: params.borrowerType,
      borrowerDepartment: params.borrowerDepartment,
      borrowerYearSection: params.borrowerYearSection,
      borrowerEmail: params.borrowerEmail,
      borrowerPhone: params.borrowerPhone,
      issueDate: params.issueDate,
      dueDate: params.dueDate,
      status: 'active',
      renewalCount: 0,
      fineAmount: 0,
      finePaid: false,
      remarks: params.remarks,
      issuedBy: params.issuedBy || 'CSE Department Librarian',
    };

    const issues = this.getIssues();
    issues.unshift(newRecord);
    this.saveIssues(issues);

    return { success: true, issueRecord: newRecord, message: 'Book issued successfully.' };
  },

  returnBook(params: {
    issueId: string;
    returnDate: string;
    condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
    finePaid: boolean;
    fineWaived?: boolean;
    remarks?: string;
  }): { success: boolean; message: string; fineCharged?: number } {
    const issues = this.getIssues();
    const issueIndex = issues.findIndex((i) => i.id === params.issueId);

    if (issueIndex === -1) {
      return { success: false, message: 'Issue record not found.' };
    }

    const issue = issues[issueIndex];
    const { fine } = calculateOverdueInfo(issue.dueDate);
    const finalFine = params.fineWaived ? 0 : fine;

    issue.status = 'returned';
    issue.returnDate = params.returnDate;
    issue.conditionOnReturn = params.condition;
    issue.fineAmount = finalFine;
    issue.finePaid = params.finePaid || params.fineWaived || false;
    issue.remarks = params.remarks ? `${issue.remarks ? issue.remarks + ' | ' : ''}${params.remarks}` : issue.remarks;

    this.saveIssues(issues);

    // Update Book copy and count
    const books = this.getBooks();
    const book = books.find((b) => b.id === issue.bookId);
    if (book) {
      const copy = book.copies.find((c) => c.copyId === issue.copyId || c.accessionNumber.includes(issue.copyId));
      if (copy) {
        copy.isAvailable = true;
        copy.issuedTo = undefined;
        copy.condition = params.condition === 'Damaged' ? 'Fair' : params.condition;
      }
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      this.saveBooks(books);

      // Check if reservations exist for this book
      const reservations = this.getReservations();
      const waitingRes = reservations.find((r) => r.bookId === book.id && r.status === 'waiting');
      if (waitingRes) {
        waitingRes.status = 'ready';
        this.saveReservations(reservations);
      }
    }

    return {
      success: true,
      message: `Book returned successfully. ${finalFine > 0 ? `Fine assessed: ₹${finalFine}` : 'No overdue fine.'}`,
      fineCharged: finalFine,
    };
  },

  renewBook(issueId: string, additionalDays: number = 14): { success: boolean; message: string; newDueDate?: string } {
    const issues = this.getIssues();
    const issue = issues.find((i) => i.id === issueId);

    if (!issue) {
      return { success: false, message: 'Issue record not found.' };
    }

    if (issue.status === 'returned') {
      return { success: false, message: 'Cannot renew an already returned book.' };
    }

    if (issue.renewalCount >= 3) {
      return { success: false, message: 'Maximum renewal limit (3 times) reached. Please return the book for physical verification.' };
    }

    const currentDue = new Date(issue.dueDate);
    currentDue.setDate(currentDue.getDate() + additionalDays);
    const newDueDateStr = currentDue.toISOString().split('T')[0];

    issue.dueDate = newDueDateStr;
    issue.renewalCount += 1;
    issue.status = 'renewed';
    issue.fineAmount = 0; // Cleared on authorized renewal

    this.saveIssues(issues);

    // Update copy dueDate in Book
    const books = this.getBooks();
    const book = books.find((b) => b.id === issue.bookId);
    if (book) {
      const copy = book.copies.find((c) => c.copyId === issue.copyId);
      if (copy && copy.issuedTo) {
        copy.issuedTo.dueDate = newDueDateStr;
      }
      this.saveBooks(books);
    }

    return { success: true, message: `Renewed successfully until ${newDueDateStr}.`, newDueDate: newDueDateStr };
  },

  addBook(newBookData: Omit<Book, 'id' | 'accessionNo' | 'copies' | 'availableCopies'>): Book {
    const books = this.getBooks();
    const nextNum = books.length + 1;
    const bookId = `book-${Date.now()}`;
    const accessionNo = `KPRIET-CSE-B${String(nextNum).padStart(3, '0')}`;

    const copies = Array.from({ length: newBookData.totalCopies }, (_, idx) => ({
      copyId: `C${nextNum}-${String(idx + 1).padStart(2, '0')}`,
      accessionNumber: `${accessionNo}-${String(idx + 1).padStart(2, '0')}`,
      isAvailable: true,
      condition: 'Excellent' as const,
    }));

    const book: Book = {
      ...newBookData,
      id: bookId,
      accessionNo,
      availableCopies: newBookData.totalCopies,
      copies,
      coverGradient: newBookData.coverGradient || 'from-indigo-600 to-slate-900',
    };

    books.unshift(book);
    this.saveBooks(books);
    return book;
  },

  addMultipleBooks(booksList: Array<Omit<Book, 'id' | 'accessionNo' | 'copies' | 'availableCopies'>>): Book[] {
    const books = this.getBooks();
    const createdBooks: Book[] = [];
    let nextNum = books.length + 1;

    for (const item of booksList) {
      const bookId = `book-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const accessionNo = `KPRIET-CSE-B${String(nextNum).padStart(3, '0')}`;

      const totalCopies = Math.max(1, item.totalCopies || 1);
      const copies = Array.from({ length: totalCopies }, (_, idx) => ({
        copyId: `C${nextNum}-${String(idx + 1).padStart(2, '0')}`,
        accessionNumber: `${accessionNo}-${String(idx + 1).padStart(2, '0')}`,
        isAvailable: true,
        condition: 'Excellent' as const,
      }));

      const newBook: Book = {
        ...item,
        id: bookId,
        accessionNo,
        availableCopies: totalCopies,
        copies,
        coverGradient: item.coverGradient || 'from-indigo-600 to-slate-900',
      };

      createdBooks.push(newBook);
      books.unshift(newBook);
      nextNum++;
    }

    this.saveBooks(books);
    return createdBooks;
  },

  reserveBook(bookId: string, studentData: { name: string; rollNo: string; email: string; phone: string }): { success: boolean; message: string } {
    const books = this.getBooks();
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      return { success: false, message: 'Book not found.' };
    }

    const reservations = this.getReservations();
    const alreadyReserved = reservations.some((r) => r.bookId === bookId && r.rollNo === studentData.rollNo && r.status === 'waiting');
    if (alreadyReserved) {
      return { success: false, message: 'You already have an active reservation for this book.' };
    }

    const bookWaitingCount = reservations.filter((r) => r.bookId === bookId && r.status === 'waiting').length;

    const newRes: ReservationRecord = {
      id: `res-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      accessionNo: book.accessionNo,
      studentName: studentData.name,
      rollNo: studentData.rollNo,
      email: studentData.email,
      phone: studentData.phone,
      reservationDate: new Date().toISOString().split('T')[0],
      status: book.availableCopies > 0 ? 'ready' : 'waiting',
      priorityOrder: bookWaitingCount + 1,
    };

    reservations.unshift(newRes);
    this.saveReservations(reservations);

    return {
      success: true,
      message: `Reservation placed successfully! Queue priority: #${newRes.priorityOrder}. You will receive notification when a copy is checked in.`,
    };
  },

  cancelReservation(resId: string): void {
    const reservations = this.getReservations();
    const updated = reservations.map((r) => (r.id === resId ? { ...r, status: 'cancelled' as const } : r));
    this.saveReservations(updated);
  },

  getStats(): LibraryStats {
    const books = this.getBooks();
    const issues = this.getIssues();
    const reservations = this.getReservations();

    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
    const activeIssues = issues.filter((i) => i.status === 'active' || i.status === 'overdue' || i.status === 'renewed');
    const issuedCopies = activeIssues.length;
    const overdueCount = activeIssues.filter((i) => i.status === 'overdue').length;

    const uniqueBorrowers = new Set(activeIssues.map((i) => i.borrowerRollNo)).size;
    const totalFinesCollected = issues.filter((i) => i.finePaid).reduce((acc, i) => acc + (i.fineAmount || 0), 0);
    const pendingReservations = reservations.filter((r) => r.status === 'waiting' || r.status === 'ready').length;

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      overdueCount,
      activeBorrowersCount: uniqueBorrowers,
      totalFinesCollected,
      pendingReservations,
    };
  },

  resetDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
  },

  exportToCSV(records: IssueRecord[]): string {
    const headers = [
      'Transaction ID',
      'Book Title',
      'Accession No',
      'Copy Barcode',
      'Borrower Name',
      'Roll Number',
      'Type',
      'Department / Section',
      'Email',
      'Issue Date',
      'Due Date',
      'Return Date',
      'Status',
      'Fine (INR)',
      'Fine Status',
      'Issued By',
    ];

    const rows = records.map((r) => [
      `"${r.transactionId}"`,
      `"${r.bookTitle.replace(/"/g, '""')}"`,
      `"${r.accessionNo}"`,
      `"${r.copyId}"`,
      `"${r.borrowerName}"`,
      `"${r.borrowerRollNo}"`,
      `"${r.borrowerType}"`,
      `"${r.borrowerYearSection || r.borrowerDepartment}"`,
      `"${r.borrowerEmail}"`,
      `"${r.issueDate}"`,
      `"${r.dueDate}"`,
      `"${r.returnDate || '-'}"`,
      `"${r.status.toUpperCase()}"`,
      r.fineAmount || 0,
      r.finePaid ? 'PAID' : r.fineAmount > 0 ? 'UNPAID' : 'N/A',
      `"${r.issuedBy}"`,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  },

  exportBooksToCSV(books: Book[]): string {
    const headers = [
      'Book ID',
      'Accession No',
      'Title',
      'Author',
      'Subject Code',
      'Subject Name',
      'Category',
      'Semester',
      'Publisher',
      'Edition',
      'Year',
      'ISBN',
      'Total Copies',
      'Available Copies',
      'Rack ID',
      'Rack Location',
      'Description',
    ];

    const rows = books.map((b) => [
      `"${b.id}"`,
      `"${b.accessionNo}"`,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      `"${b.subjectCode || ''}"`,
      `"${(b.subjectName || '').replace(/"/g, '""')}"`,
      `"${b.category}"`,
      `"${b.semester}"`,
      `"${(b.publisher || '').replace(/"/g, '""')}"`,
      `"${b.edition || ''}"`,
      b.year || '',
      `"${b.isbn || ''}"`,
      b.totalCopies,
      b.availableCopies,
      `"${b.rackId}"`,
      `"${b.rackLocation}"`,
      `"${(b.description || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  },

  exportAllDataJSON(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      institution: 'KPR Institute of Engineering and Technology',
      department: 'Department of Computer Science and Engineering',
      books: this.getBooks(),
      issues: this.getIssues(),
      reservations: this.getReservations(),
      stats: this.getStats(),
    };
    return JSON.stringify(data, null, 2);
  },
};

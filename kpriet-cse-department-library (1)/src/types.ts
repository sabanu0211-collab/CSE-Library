export type BorrowerType = 'student' | 'faculty' | 'researcher';

export type BookCategory =
  | 'Data Structures & Algorithms'
  | 'Database Management Systems'
  | 'Operating Systems & System Software'
  | 'Artificial Intelligence & Machine Learning'
  | 'Computer Networks & Security'
  | 'Software Engineering & Agile'
  | 'Computer Architecture & Microprocessors'
  | 'Theory of Computation & Compiler Design'
  | 'Cloud Computing & Distributed Systems'
  | 'Programming Languages & Web Tech'
  | 'Mathematics & Discrete Structures'
  | 'Project Reference & Research Papers';

export interface BookCopy {
  copyId: string;
  accessionNumber: string;
  isAvailable: boolean;
  issuedTo?: {
    rollNo: string;
    name: string;
    dueDate: string;
    issueDate: string;
  };
  condition: 'Excellent' | 'Good' | 'Fair' | 'Reference Only';
}

export interface Book {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  year: number;
  category: BookCategory;
  subjectCode: string;
  subjectName: string;
  semester: number | 'Elective' | 'Core Reference';
  totalCopies: number;
  availableCopies: number;
  rackLocation: string; // e.g. "Rack CSE-03, Shelf B"
  rackId: string; // e.g. "CSE-03"
  description: string;
  copies: BookCopy[];
  tags: string[];
  coverGradient: string;
}

export interface IssueRecord {
  id: string;
  transactionId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  accessionNo: string;
  copyId: string;
  borrowerName: string;
  borrowerRollNo: string;
  borrowerType: BorrowerType;
  borrowerDepartment: string;
  borrowerYearSection: string;
  borrowerEmail: string;
  borrowerPhone: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: 'active' | 'returned' | 'overdue' | 'renewed';
  renewalCount: number;
  fineAmount: number;
  finePaid: boolean;
  conditionOnReturn?: 'Excellent' | 'Good' | 'Fair' | 'Damaged';
  remarks?: string;
  issuedBy: string;
}

export interface ReservationRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  accessionNo: string;
  studentName: string;
  rollNo: string;
  email: string;
  phone: string;
  reservationDate: string;
  status: 'waiting' | 'ready' | 'fulfilled' | 'cancelled';
  priorityOrder: number;
}

export interface LibraryStats {
  totalTitles: number;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  overdueCount: number;
  activeBorrowersCount: number;
  totalFinesCollected: number;
  pendingReservations: number;
}

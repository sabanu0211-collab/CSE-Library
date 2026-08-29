import React, { useState, useRef } from 'react';
import {
  X,
  PlusCircle,
  BookOpen,
  AlertCircle,
  Plus,
  Trash2,
  FileSpreadsheet,
  Check,
  Sparkles,
  Layers,
  Upload,
  Download,
  FileUp,
  FileCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { BookCategory } from '../types';

interface AddBookModalProps {
  onClose: () => void;
  onAddBook: (bookData: any) => void;
  onAddMultipleBooks?: (booksData: any[]) => void;
}

interface ParsedExcelRow {
  id: string;
  title: string;
  author: string;
  isbn: string;
  subjectCode: string;
  subjectName: string;
  category: BookCategory;
  semester: string;
  totalCopies: number;
  rackId: string;
  rackLocation: string;
  publisher: string;
  edition: string;
  year: number;
  description: string;
  isValid: boolean;
  validationError?: string;
}

const DEFAULT_CATEGORIES: BookCategory[] = [
  'Data Structures & Algorithms',
  'Operating Systems & System Software',
  'Database Management Systems',
  'Artificial Intelligence & Machine Learning',
  'Computer Networks & Security',
  'Software Engineering & Agile',
  'Computer Architecture & Microprocessors',
  'Theory of Computation & Compiler Design',
  'Cloud Computing & Distributed Systems',
  'Mathematics & Discrete Structures',
  'Programming Languages & Web Tech',
  'Project Reference & Research Papers',
];

const RACK_MAP: Record<string, string> = {
  'CSE-01': 'Rack CSE-01, Shelf A',
  'CSE-02': 'Rack CSE-02, Shelf A',
  'CSE-03': 'Rack CSE-03, Shelf A',
  'CSE-04': 'Rack CSE-04, Shelf A',
  'CSE-05': 'Rack CSE-05, Shelf A',
  'CSE-06': 'Rack CSE-06, Shelf A',
  'CSE-07': 'Rack CSE-07, Shelf A',
  'CSE-08': 'Rack CSE-08, Shelf A',
};

const CATEGORY_DEFAULT_RACK: Record<string, string> = {
  'Data Structures & Algorithms': 'CSE-01',
  'Computer Architecture & Microprocessors': 'CSE-01',
  'Operating Systems & System Software': 'CSE-02',
  'Database Management Systems': 'CSE-02',
  'Computer Networks & Security': 'CSE-03',
  'Artificial Intelligence & Machine Learning': 'CSE-04',
  'Theory of Computation & Compiler Design': 'CSE-05',
  'Cloud Computing & Distributed Systems': 'CSE-06',
  'Mathematics & Discrete Structures': 'CSE-07',
  'Software Engineering & Agile': 'CSE-08',
  'Programming Languages & Web Tech': 'CSE-08',
  'Project Reference & Research Papers': 'CSE-08',
};

// Normalize category string from Excel input
function matchCategory(inputStr?: string): BookCategory {
  if (!inputStr) return 'Data Structures & Algorithms';
  const str = inputStr.toLowerCase().trim();
  if (str.includes('data struct') || str.includes('algorithm')) return 'Data Structures & Algorithms';
  if (str.includes('operat') || str.includes('system soft')) return 'Operating Systems & System Software';
  if (str.includes('dbms') || str.includes('database') || str.includes('sql')) return 'Database Management Systems';
  if (str.includes('ai') || str.includes('ml') || str.includes('machine learn') || str.includes('intelligence') || str.includes('deep learn'))
    return 'Artificial Intelligence & Machine Learning';
  if (str.includes('network') || str.includes('security') || str.includes('crypto')) return 'Computer Networks & Security';
  if (str.includes('software') || str.includes('agile') || str.includes('testing')) return 'Software Engineering & Agile';
  if (str.includes('architect') || str.includes('microprocess') || str.includes('hardware'))
    return 'Computer Architecture & Microprocessors';
  if (str.includes('compiler') || str.includes('computation') || str.includes('automata') || str.includes('toc'))
    return 'Theory of Computation & Compiler Design';
  if (str.includes('cloud') || str.includes('distributed') || str.includes('devops') || str.includes('aws'))
    return 'Cloud Computing & Distributed Systems';
  if (str.includes('math') || str.includes('discrete') || str.includes('probab')) return 'Mathematics & Discrete Structures';
  if (str.includes('programming') || str.includes('web') || str.includes('python') || str.includes('java'))
    return 'Programming Languages & Web Tech';
  return 'Project Reference & Research Papers';
}

const SAMPLE_BATCH_PACKAGES = [
  {
    name: '🤖 AI & Deep Learning Batch',
    books: [
      {
        title: 'Deep Learning with Python',
        author: 'François Chollet',
        isbn: '978-1617296864',
        subjectCode: 'AL3501',
        category: 'Artificial Intelligence & Machine Learning' as BookCategory,
        semester: '5',
        totalCopies: 4,
        rackId: 'CSE-04',
        rackLocation: 'Rack CSE-04, Shelf B',
        publisher: 'Manning Publications',
      },
      {
        title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
        author: 'Aurélien Géron',
        isbn: '978-1098125974',
        subjectCode: 'AL3452',
        category: 'Artificial Intelligence & Machine Learning' as BookCategory,
        semester: '4',
        totalCopies: 3,
        rackId: 'CSE-04',
        rackLocation: 'Rack CSE-04, Shelf A',
        publisher: "O'Reilly Media",
      },
      {
        title: 'Pattern Recognition and Machine Learning',
        author: 'Christopher M. Bishop',
        isbn: '978-0387310732',
        subjectCode: 'CS3601',
        category: 'Artificial Intelligence & Machine Learning' as BookCategory,
        semester: '6',
        totalCopies: 2,
        rackId: 'CSE-04',
        rackLocation: 'Rack CSE-04, Shelf C',
        publisher: 'Springer',
      },
    ],
  },
  {
    name: '☁️ Cloud, DevOps & Full Stack Batch',
    books: [
      {
        title: 'Cloud Native DevOps with Kubernetes',
        author: 'John Arundel, Justin Domingus',
        isbn: '978-1492040767',
        subjectCode: 'CCS335',
        category: 'Cloud Computing & Distributed Systems' as BookCategory,
        semester: '6',
        totalCopies: 4,
        rackId: 'CSE-06',
        rackLocation: 'Rack CSE-06, Shelf A',
        publisher: "O'Reilly Media",
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '978-1449373320',
        subjectCode: 'CS3502',
        category: 'Database Management Systems' as BookCategory,
        semester: '5',
        totalCopies: 5,
        rackId: 'CSE-02',
        rackLocation: 'Rack CSE-02, Shelf C',
        publisher: "O'Reilly Media",
      },
      {
        title: 'Full Stack React, TypeScript, and Node',
        author: 'David Choi',
        isbn: '978-1800562653',
        subjectCode: 'CS3401',
        category: 'Programming Languages & Web Tech' as BookCategory,
        semester: '4',
        totalCopies: 3,
        rackId: 'CSE-08',
        rackLocation: 'Rack CSE-08, Shelf B',
        publisher: 'Packt Publishing',
      },
    ],
  },
];

export const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook, onAddMultipleBooks }) => {
  const [entryMode, setEntryMode] = useState<'excel' | 'bulk' | 'single'>('excel');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Excel state
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [parsedRows, setParsedRows] = useState<ParsedExcelRow[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Single book state
  const [singleTitle, setSingleTitle] = useState('');
  const [singleAuthor, setSingleAuthor] = useState('');
  const [singleIsbn, setSingleIsbn] = useState('');
  const [singlePublisher, setSinglePublisher] = useState('Pearson / Academic');
  const [singleEdition, setSingleEdition] = useState('Latest Edition');
  const [singleYear, setSingleYear] = useState(2024);
  const [singleCategory, setSingleCategory] = useState<BookCategory>('Data Structures & Algorithms');
  const [singleSubjectCode, setSingleSubjectCode] = useState('CS3351');
  const [singleSubjectName, setSingleSubjectName] = useState('Data Structures & Algorithms');
  const [singleSemester, setSingleSemester] = useState('3');
  const [singleTotalCopies, setSingleTotalCopies] = useState(3);
  const [singleRackId, setSingleRackId] = useState('CSE-01');
  const [singleRackLocation, setSingleRackLocation] = useState('Rack CSE-01, Shelf A');
  const [singleDescription, setSingleDescription] = useState('');
  const [singleTags, setSingleTags] = useState('Algorithms, Core CSE, TextBook');

  // Manual bulk table rows state
  const [manualRows, setManualRows] = useState<ParsedExcelRow[]>([
    {
      id: 'row-1',
      title: 'Python for Data Analysis: Data Wrangling with Pandas and NumPy',
      author: 'Wes McKinney',
      isbn: '978-1098104030',
      subjectCode: 'AD3351',
      subjectName: 'Design & Analysis of Algorithms',
      category: 'Artificial Intelligence & Machine Learning',
      semester: '3',
      totalCopies: 4,
      rackId: 'CSE-04',
      rackLocation: 'Rack CSE-04, Shelf A',
      publisher: "O'Reilly Media",
      edition: '3rd Edition',
      year: 2024,
      description: 'Pandas and NumPy data science reference',
      isValid: true,
    },
    {
      id: 'row-2',
      title: 'Operating System Concepts (10th Global Edition)',
      author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
      isbn: '978-1119456339',
      subjectCode: 'CS3451',
      subjectName: 'Operating Systems',
      category: 'Operating Systems & System Software',
      semester: '4',
      totalCopies: 5,
      rackId: 'CSE-02',
      rackLocation: 'Rack CSE-02, Shelf B',
      publisher: 'Wiley',
      edition: '10th Edition',
      year: 2023,
      description: 'Core OS concepts and multithreading',
      isValid: true,
    },
    {
      id: 'row-3',
      title: 'Cryptography and Network Security: Principles and Practice',
      author: 'William Stallings',
      isbn: '978-0134444284',
      subjectCode: 'CS3601',
      subjectName: 'Network Security',
      category: 'Computer Networks & Security',
      semester: '6',
      totalCopies: 4,
      rackId: 'CSE-03',
      rackLocation: 'Rack CSE-03, Shelf A',
      publisher: 'Pearson',
      edition: '8th Edition',
      year: 2023,
      description: 'Applied cryptography and network defense',
      isValid: true,
    },
  ]);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Process Excel / CSV file
  const processExcelFile = (file: File) => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsProcessingFile(true);
    setExcelFile(file);
    setExcelFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          setErrorMsg('The uploaded workbook contains no readable sheets.');
          setIsProcessingFile(false);
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          setErrorMsg('The uploaded sheet contains no data rows.');
          setIsProcessingFile(false);
          return;
        }

        // Helper to find column case-insensitively
        const findVal = (row: any, ...keys: string[]) => {
          for (const key of keys) {
            if (row[key] !== undefined && row[key] !== '') return String(row[key]).trim();
          }
          // Case-insensitive key match
          const rowKeys = Object.keys(row);
          for (const target of keys) {
            const foundKey = rowKeys.find((k) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === target.toLowerCase().replace(/[^a-z0-9]/g, ''));
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') {
              return String(row[foundKey]).trim();
            }
          }
          return '';
        };

        const rows: ParsedExcelRow[] = [];

        rawJson.forEach((row, idx) => {
          const title = findVal(row, 'Book Title', 'Title', 'book_title', 'book title', 'name', 'Title of the Book');
          const author = findVal(row, 'Author', 'Authors', 'Author(s)', 'author', 'author_name', 'Author Name');
          const isbn = findVal(row, 'ISBN', 'isbn', 'ISBN Code', 'isbn_code') || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
          const subjectCode = (findVal(row, 'Subject Code', 'SubjectCode', 'Course Code', 'Subject', 'subject_code') || 'CS3' + Math.floor(300 + Math.random() * 600)).toUpperCase();
          const subjectName = findVal(row, 'Subject Name', 'SubjectName', 'Course Name', 'subject_name') || `${subjectCode} Reference`;
          const rawCategory = findVal(row, 'Category', 'category', 'Domain', 'Specialization');
          const category = matchCategory(rawCategory || subjectName);
          const semester = findVal(row, 'Semester', 'Sem', 'semester') || '3';
          const copiesRaw = parseInt(findVal(row, 'Copies', 'Total Copies', 'totalCopies', 'Quantity', 'Qty', 'copies')) || 3;
          const totalCopies = Math.max(1, Math.min(50, copiesRaw));
          const rackId = (findVal(row, 'Rack', 'Rack ID', 'rackId', 'rack_id', 'RackId') || CATEGORY_DEFAULT_RACK[category] || 'CSE-01').toUpperCase();
          const rackLocation = findVal(row, 'Rack Location', 'rackLocation', 'Shelf', 'Location') || RACK_MAP[rackId] || `Rack ${rackId}, Shelf A`;
          const publisher = findVal(row, 'Publisher', 'publisher') || 'Standard Academic Publisher';
          const edition = findVal(row, 'Edition', 'edition') || 'Latest Edition';
          const year = parseInt(findVal(row, 'Year', 'year', 'Pub Year')) || 2024;
          const description = findVal(row, 'Description', 'description', 'Topics') || `KPRIET CSE Dept Textbook: ${title} for ${subjectCode}.`;

          const isValid = Boolean(title && author);

          if (title || author) {
            rows.push({
              id: `excel-row-${idx}-${Date.now()}`,
              title: title || 'Untitled Book',
              author: author || 'Unknown Author',
              isbn,
              subjectCode,
              subjectName,
              category,
              semester,
              totalCopies,
              rackId,
              rackLocation,
              publisher,
              edition,
              year,
              description,
              isValid,
              validationError: !title ? 'Title missing' : !author ? 'Author missing' : undefined,
            });
          }
        });

        if (rows.length === 0) {
          setErrorMsg('No valid book entries could be extracted. Please check the Excel format.');
        } else {
          setParsedRows(rows);
          setSuccessMsg(`Successfully parsed ${rows.length} book titles from "${file.name}". Review and click Register below.`);
        }
      } catch (err: any) {
        console.error('Error parsing Excel file:', err);
        setErrorMsg('Failed to parse Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.');
      } finally {
        setIsProcessingFile(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        processExcelFile(file);
      } else {
        setErrorMsg('Please drop a valid Excel file (.xlsx, .xls) or CSV file (.csv).');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processExcelFile(file);
    }
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    const templateData = [
      {
        'Book Title': 'Introduction to Algorithms (4th Edition)',
        Author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        ISBN: '978-0262046305',
        'Subject Code': 'CS3351',
        'Subject Name': 'Data Structures & Algorithms',
        Category: 'Data Structures & Algorithms',
        Semester: '3',
        'Total Copies': 5,
        'Rack ID': 'CSE-01',
        'Rack Location': 'Rack CSE-01, Shelf A',
        Publisher: 'MIT Press',
        Edition: '4th Edition',
        Year: 2022,
        Description: 'Comprehensive textbook on design and analysis of algorithms with graph algorithms and dynamic programming.',
      },
      {
        'Book Title': 'Database System Concepts (7th Edition)',
        Author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
        ISBN: '978-0078022159',
        'Subject Code': 'CS3452',
        'Subject Name': 'Database Management Systems',
        Category: 'Database Management Systems',
        Semester: '4',
        'Total Copies': 4,
        'Rack ID': 'CSE-02',
        'Rack Location': 'Rack CSE-02, Shelf A',
        Publisher: 'McGraw-Hill Education',
        Edition: '7th Edition',
        Year: 2020,
        Description: 'Standard textbook for relational algebra, SQL, normalization, concurrency control, and transactions.',
      },
      {
        'Book Title': 'Deep Learning with Python',
        Author: 'François Chollet',
        ISBN: '978-1617296864',
        'Subject Code': 'AL3501',
        'Subject Name': 'Deep Learning Technologies',
        Category: 'Artificial Intelligence & Machine Learning',
        Semester: '5',
        'Total Copies': 3,
        'Rack ID': 'CSE-04',
        'Rack Location': 'Rack CSE-04, Shelf B',
        Publisher: 'Manning Publications',
        Edition: '2nd Edition',
        Year: 2021,
        Description: 'Hands-on practical deep learning with Keras, TensorFlow, and computer vision / NLP architectures.',
      },
      {
        'Book Title': 'Computer Networks: A Systems Approach',
        Author: 'Larry L. Peterson, Bruce S. Davie',
        ISBN: '978-0123850591',
        'Subject Code': 'CS3591',
        'Subject Name': 'Computer Networks',
        Category: 'Computer Networks & Security',
        Semester: '5',
        'Total Copies': 4,
        'Rack ID': 'CSE-03',
        'Rack Location': 'Rack CSE-03, Shelf A',
        Publisher: 'Morgan Kaufmann',
        Edition: '6th Edition',
        Year: 2021,
        Description: 'Layered architecture, TCP/IP congestion control, routing protocols, and socket programming.',
      },
      {
        'Book Title': 'Cloud Native DevOps with Kubernetes',
        Author: 'John Arundel, Justin Domingus',
        ISBN: '978-1492040767',
        'Subject Code': 'CCS335',
        'Subject Name': 'Cloud & DevOps Engineering',
        Category: 'Cloud Computing & Distributed Systems',
        Semester: '6',
        'Total Copies': 3,
        'Rack ID': 'CSE-06',
        'Rack Location': 'Rack CSE-06, Shelf A',
        Publisher: "O'Reilly Media",
        Edition: '2nd Edition',
        Year: 2022,
        Description: 'Building resilient containerized microservices with Docker, Kubernetes, and CI/CD pipelines.',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Auto-width columns
    const colWidths = [
      { wch: 45 }, // Book Title
      { wch: 40 }, // Author
      { wch: 18 }, // ISBN
      { wch: 14 }, // Subject Code
      { wch: 30 }, // Subject Name
      { wch: 35 }, // Category
      { wch: 10 }, // Semester
      { wch: 12 }, // Total Copies
      { wch: 10 }, // Rack ID
      { wch: 24 }, // Rack Location
      { wch: 22 }, // Publisher
      { wch: 14 }, // Edition
      { wch: 8 },  // Year
      { wch: 50 }, // Description
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CSE_Book_Upload_Template');

    if (format === 'xlsx') {
      XLSX.writeFile(workbook, 'KPRIET_CSE_Book_Upload_Template.xlsx');
    } else {
      XLSX.writeFile(workbook, 'KPRIET_CSE_Book_Upload_Template.csv');
    }
  };

  // Submit Parsed Excel Books
  const handleSubmitExcelBooks = () => {
    if (parsedRows.length === 0) {
      setErrorMsg('No books to register. Please upload a spreadsheet first.');
      return;
    }

    const invalid = parsedRows.filter((r) => !r.title.trim() || !r.author.trim());
    if (invalid.length > 0) {
      setErrorMsg(`There are ${invalid.length} rows with missing Title or Author. Please fix or remove them.`);
      return;
    }

    const booksData = parsedRows.map((r) => ({
      title: r.title.trim(),
      author: r.author.trim(),
      isbn: r.isbn.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      publisher: r.publisher.trim() || 'CSE Department Library Publications',
      edition: r.edition || 'Latest Edition',
      year: r.year || 2024,
      category: r.category,
      subjectCode: r.subjectCode.trim().toUpperCase() || 'CSE-CORE',
      subjectName: r.subjectName || `${r.category} Text`,
      semester: r.semester === 'Elective' ? 'Elective' : Number(r.semester) || 3,
      totalCopies: Math.max(1, Number(r.totalCopies) || 1),
      rackLocation: r.rackLocation || RACK_MAP[r.rackId] || `Rack ${r.rackId}, Shelf A`,
      rackId: r.rackId || 'CSE-01',
      description: r.description || `KPRIET CSE Department Library Reference: ${r.title}`,
      tags: [r.category, r.subjectCode, 'KPRIET', 'CSE Department'],
      coverGradient: 'from-amber-600 to-indigo-900',
    }));

    if (onAddMultipleBooks) {
      onAddMultipleBooks(booksData);
    } else {
      booksData.forEach((b) => onAddBook(b));
    }
  };

  // Handle Manual Bulk Submit
  const handleSubmitManualBulk = () => {
    const invalid = manualRows.find((r) => !r.title.trim() || !r.author.trim());
    if (invalid) {
      setErrorMsg('All book rows must have a valid Title and Author.');
      return;
    }

    const booksData = manualRows.map((r) => ({
      title: r.title.trim(),
      author: r.author.trim(),
      isbn: r.isbn.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      publisher: r.publisher.trim() || 'Pearson',
      edition: r.edition || 'Latest Edition',
      year: r.year || 2024,
      category: r.category,
      subjectCode: r.subjectCode.trim().toUpperCase() || 'CSE-CORE',
      subjectName: `${r.category} Reference`,
      semester: r.semester === 'Elective' ? 'Elective' : Number(r.semester) || 3,
      totalCopies: Math.max(1, Number(r.totalCopies) || 1),
      rackLocation: r.rackLocation,
      rackId: r.rackId,
      description: `CSE Department Library textbook: ${r.title} for ${r.subjectCode}.`,
      tags: [r.category, r.subjectCode, 'CSE Department', 'Syllabus'],
      coverGradient: 'from-indigo-600 to-slate-900',
    }));

    if (onAddMultipleBooks) {
      onAddMultipleBooks(booksData);
    } else {
      booksData.forEach((b) => onAddBook(b));
    }
  };

  // Handle Single Book Submit
  const handleSubmitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleTitle.trim() || !singleAuthor.trim() || !singleIsbn.trim()) {
      setErrorMsg('Title, Author, and ISBN are required.');
      return;
    }

    const tagsArray = singleTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const bookData = {
      title: singleTitle.trim(),
      author: singleAuthor.trim(),
      isbn: singleIsbn.trim(),
      publisher: singlePublisher.trim(),
      edition: singleEdition.trim(),
      year: Number(singleYear) || 2024,
      category: singleCategory,
      subjectCode: singleSubjectCode.trim().toUpperCase(),
      subjectName: singleSubjectName.trim(),
      semester: singleSemester === 'Elective' ? 'Elective' : Number(singleSemester),
      totalCopies: Math.max(1, Number(singleTotalCopies)),
      rackLocation: singleRackLocation,
      rackId: singleRackId,
      description: singleDescription.trim() || `Textbook for ${singleSubjectCode} - ${singleTitle}`,
      tags: tagsArray.length > 0 ? tagsArray : ['CSE', 'Academic'],
      coverGradient: 'from-indigo-600 to-slate-900',
    };

    onAddBook(bookData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl my-4 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Upload & Add Books to CSE Department Library
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Admin Only
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Excel (.xlsx, .xls, .csv) bulk import with automatic accession number and physical copy generation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setEntryMode('excel');
                setErrorMsg('');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-2 ${
                entryMode === 'excel'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Excel / CSV File</span>
              {parsedRows.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-amber-300 font-mono">
                  {parsedRows.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setEntryMode('bulk');
                setErrorMsg('');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                entryMode === 'bulk'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Table Rows</span>
            </button>

            <button
              onClick={() => {
                setEntryMode('single');
                setErrorMsg('');
              }}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                entryMode === 'single'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Single Title Form</span>
            </button>
          </div>

          {/* Template Download Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Download Sample Template:</span>
            <button
              onClick={() => handleDownloadTemplate('xlsx')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold transition-colors"
              title="Download formatted Excel (.xlsx) template"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => handleDownloadTemplate('csv')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
              title="Download CSV template"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center gap-2.5 flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center gap-2.5 flex-shrink-0">
            <FileCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {/* MODE 1: EXCEL FILE UPLOAD & PREVIEW */}
          {entryMode === 'excel' && (
            <div className="space-y-5">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10'
                    : excelFile
                    ? 'border-emerald-600/70 bg-emerald-950/20 hover:border-emerald-500'
                    : 'border-slate-700 bg-slate-950/60 hover:border-slate-500 hover:bg-slate-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    excelFile
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isProcessingFile ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : excelFile ? (
                    <FileCheck className="w-6 h-6" />
                  ) : (
                    <FileUp className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {excelFile ? `Selected: ${excelFileName}` : 'Drag & Drop your Excel (.xlsx, .xls) or CSV file here'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {excelFile
                      ? `${parsedRows.length} book titles parsed ready to import. Click to choose another file.`
                      : 'or click to browse from your computer'}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                    Columns: Title, Author, ISBN, SubjectCode, Category, Copies, RackID
                  </span>
                </div>
              </div>

              {/* Parsed Books Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                        <span>Extracted Book Titles Preview</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          {parsedRows.length} Titles
                        </span>
                        <span className="text-xs text-slate-400">
                          ({parsedRows.reduce((a, b) => a + (Number(b.totalCopies) || 1), 0)} total copies)
                        </span>
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        setParsedRows([]);
                        setExcelFile(null);
                        setExcelFileName('');
                        setSuccessMsg('');
                      }}
                      className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Upload</span>
                    </button>
                  </div>

                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0">
                        <tr>
                          <th className="px-3 py-2.5 font-semibold">#</th>
                          <th className="px-3 py-2.5 font-semibold">Book Title & Author</th>
                          <th className="px-3 py-2.5 font-semibold">Subject / Category</th>
                          <th className="px-3 py-2.5 font-semibold">Copies</th>
                          <th className="px-3 py-2.5 font-semibold">Shelf Rack</th>
                          <th className="px-3 py-2.5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {parsedRows.map((row, idx) => (
                          <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px]">{idx + 1}</td>
                            <td className="px-3 py-2.5">
                              <div className="font-semibold text-slate-200 line-clamp-1">{row.title}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">By {row.author}</div>
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="font-mono text-amber-400 text-[11px] font-medium">{row.subjectCode}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">{row.category}</div>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800 font-mono font-semibold">
                                {row.totalCopies} copies
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="text-[11px] text-amber-300 font-medium">{row.rackLocation}</span>
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <button
                                onClick={() => setParsedRows(parsedRows.filter((r) => r.id !== row.id))}
                                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                                title="Remove row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: INTERACTIVE TABLE ROWS */}
          {entryMode === 'bulk' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Manually configure multiple book titles. Accession numbers and individual shelf copies will be generated automatically.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextRow: ParsedExcelRow = {
                        id: `manual-row-${Date.now()}-${Math.random()}`,
                        title: '',
                        author: '',
                        isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                        subjectCode: 'CS3' + Math.floor(300 + Math.random() * 600),
                        subjectName: 'Core Computer Science Subject',
                        category: 'Data Structures & Algorithms',
                        semester: '3',
                        totalCopies: 3,
                        rackId: 'CSE-01',
                        rackLocation: 'Rack CSE-01, Shelf A',
                        publisher: 'Pearson',
                        edition: 'Latest Edition',
                        year: 2024,
                        description: '',
                        isValid: true,
                      };
                      setManualRows([...manualRows, nextRow]);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-semibold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {manualRows.map((row, idx) => (
                  <div
                    key={row.id}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>Book Title #{idx + 1}</span>
                      </span>
                      <button
                        onClick={() => {
                          if (manualRows.length > 1) {
                            setManualRows(manualRows.filter((r) => r.id !== row.id));
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                      <div className="md:col-span-6 space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">Book Title *</label>
                        <input
                          type="text"
                          required
                          value={row.title}
                          onChange={(e) =>
                            setManualRows(
                              manualRows.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r))
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs"
                          placeholder="e.g. Clean Code"
                        />
                      </div>

                      <div className="md:col-span-6 space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">Author(s) *</label>
                        <input
                          type="text"
                          required
                          value={row.author}
                          onChange={(e) =>
                            setManualRows(
                              manualRows.map((r) => (r.id === row.id ? { ...r, author: e.target.value } : r))
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs"
                          placeholder="e.g. Robert C. Martin"
                        />
                      </div>

                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">Subject Code</label>
                        <input
                          type="text"
                          value={row.subjectCode}
                          onChange={(e) =>
                            setManualRows(
                              manualRows.map((r) => (r.id === row.id ? { ...r, subjectCode: e.target.value } : r))
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs font-mono"
                        />
                      </div>

                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">Category</label>
                        <select
                          value={row.category}
                          onChange={(e) => {
                            const cat = e.target.value as BookCategory;
                            const rId = CATEGORY_DEFAULT_RACK[cat] || 'CSE-01';
                            setManualRows(
                              manualRows.map((r) =>
                                r.id === row.id
                                  ? { ...r, category: cat, rackId: rId, rackLocation: RACK_MAP[rId] || r.rackLocation }
                                  : r
                              )
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                        >
                          {DEFAULT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">Shelf Rack</label>
                        <select
                          value={row.rackId}
                          onChange={(e) =>
                            setManualRows(
                              manualRows.map((r) =>
                                r.id === row.id
                                  ? { ...r, rackId: e.target.value, rackLocation: RACK_MAP[e.target.value] || `Rack ${e.target.value}, Shelf A` }
                                  : r
                              )
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                        >
                          <option value="CSE-01">Rack CSE-01 (DS/Arch)</option>
                          <option value="CSE-02">Rack CSE-02 (OS/DBMS)</option>
                          <option value="CSE-03">Rack CSE-03 (Networks)</option>
                          <option value="CSE-04">Rack CSE-04 (AI/ML)</option>
                          <option value="CSE-05">Rack CSE-05 (Theory/Compilers)</option>
                          <option value="CSE-06">Rack CSE-06 (Cloud/Distributed)</option>
                          <option value="CSE-07">Rack CSE-07 (Math/Discrete)</option>
                          <option value="CSE-08">Rack CSE-08 (Reference/Projects)</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[11px] font-medium text-slate-400">Copies</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={row.totalCopies}
                          onChange={(e) =>
                            setManualRows(
                              manualRows.map((r) => (r.id === row.id ? { ...r, totalCopies: Number(e.target.value) } : r))
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE 3: SINGLE TITLE FORM */}
          {entryMode === 'single' && (
            <form id="single-book-form" onSubmit={handleSubmitSingle} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software"
                  value={singleTitle}
                  onChange={(e) => setSingleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Author(s) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides"
                    value={singleAuthor}
                    onChange={(e) => setSingleAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">ISBN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 978-0201633610"
                    value={singleIsbn}
                    onChange={(e) => setSingleIsbn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS3351 / CS3452 / CCS341"
                    value={singleSubjectCode}
                    onChange={(e) => setSingleSubjectCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Object Oriented Analysis & Design"
                    value={singleSubjectName}
                    onChange={(e) => setSingleSubjectName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Category / Specialization</label>
                  <select
                    value={singleCategory}
                    onChange={(e) => {
                      const cat = e.target.value as BookCategory;
                      setSingleCategory(cat);
                      const rId = CATEGORY_DEFAULT_RACK[cat] || 'CSE-01';
                      setSingleRackId(rId);
                      setSingleRackLocation(RACK_MAP[rId] || 'Rack CSE-01, Shelf A');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Semester</label>
                  <select
                    value={singleSemester}
                    onChange={(e) => setSingleSemester(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                    <option value="Elective">Elective Specialization</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Total Physical Copies to Add</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={singleTotalCopies}
                    onChange={(e) => setSingleTotalCopies(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Rack & Shelf Location</label>
                  <select
                    value={singleRackId}
                    onChange={(e) => {
                      setSingleRackId(e.target.value);
                      setSingleRackLocation(RACK_MAP[e.target.value] || `Rack ${e.target.value}, Shelf A`);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
                  >
                    <option value="CSE-01">Rack CSE-01 (Data Structures / Algorithms / Arch)</option>
                    <option value="CSE-02">Rack CSE-02 (Operating Systems / DBMS)</option>
                    <option value="CSE-03">Rack CSE-03 (Networks / Security)</option>
                    <option value="CSE-04">Rack CSE-04 (AI / Machine Learning / Data Sci)</option>
                    <option value="CSE-05">Rack CSE-05 (Theory / Compilers)</option>
                    <option value="CSE-06">Rack CSE-06 (Cloud / Distributed Systems)</option>
                    <option value="CSE-07">Rack CSE-07 (Discrete Mathematics)</option>
                    <option value="CSE-08">Rack CSE-08 (Reference / Projects)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300">Description & Syllabus Topics</label>
                <textarea
                  rows={2}
                  placeholder="Key concepts, syllabus units covered..."
                  value={singleDescription}
                  onChange={(e) => setSingleDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs"
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-400">
            {entryMode === 'excel' && (
              <span>
                {parsedRows.length > 0 ? (
                  <>
                    Ready to register <strong className="text-amber-400 font-semibold">{parsedRows.length} titles</strong> ({parsedRows.reduce((a, b) => a + (Number(b.totalCopies) || 1), 0)} copies)
                  </>
                ) : (
                  'Upload an Excel (.xlsx) file above to parse books'
                )}
              </span>
            )}
            {entryMode === 'bulk' && (
              <span>
                Ready to register <strong className="text-amber-400 font-semibold">{manualRows.length} titles</strong>
              </span>
            )}
            {entryMode === 'single' && <span>Single book registration</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            {entryMode === 'excel' && (
              <button
                id="btn-submit-excel-upload"
                type="button"
                disabled={parsedRows.length === 0}
                onClick={handleSubmitExcelBooks}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Register {parsedRows.length} Titles from Excel</span>
              </button>
            )}

            {entryMode === 'bulk' && (
              <button
                id="btn-submit-bulk-books"
                type="button"
                onClick={handleSubmitManualBulk}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register {manualRows.length} Titles</span>
              </button>
            )}

            {entryMode === 'single' && (
              <button
                id="btn-submit-single-book"
                type="submit"
                form="single-book-form"
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register Single Title</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

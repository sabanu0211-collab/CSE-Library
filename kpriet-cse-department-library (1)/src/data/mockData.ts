import { Book, IssueRecord, ReservationRecord } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    accessionNo: 'KPRIET-CSE-B001',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    isbn: '978-0262033848',
    publisher: 'MIT Press / PHI',
    edition: '4th Edition',
    year: 2022,
    category: 'Data Structures & Algorithms',
    subjectCode: 'CS3351',
    subjectName: 'Data Structures and Algorithms',
    semester: 3,
    totalCopies: 6,
    availableCopies: 3,
    rackLocation: 'Rack CSE-01, Shelf A',
    rackId: 'CSE-01',
    description: 'Comprehensive modern guide to algorithm design, analysis, dynamic programming, greedy methods, graph algorithms, and NP-completeness.',
    tags: ['Algorithms', 'Sorting', 'Graphs', 'Dynamic Programming', 'Core CS'],
    coverGradient: 'from-amber-600 to-red-800',
    copies: [
      { copyId: 'C1-01', accessionNumber: 'KPRIET-CSE-B001-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C1-02', accessionNumber: 'KPRIET-CSE-B001-02', isAvailable: true, condition: 'Good' },
      { copyId: 'C1-03', accessionNumber: 'KPRIET-CSE-B001-03', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C1-04',
        accessionNumber: 'KPRIET-CSE-B001-04',
        isAvailable: false,
        issuedTo: { rollNo: '711122104042', name: 'Naveen Kumar R', dueDate: '2026-09-02', issueDate: '2026-08-19' },
        condition: 'Good'
      },
      {
        copyId: 'C1-05',
        accessionNumber: 'KPRIET-CSE-B001-05',
        isAvailable: false,
        issuedTo: { rollNo: '711123104018', name: 'Harini S', dueDate: '2026-08-20', issueDate: '2026-08-06' }, // Overdue!
        condition: 'Good'
      },
      {
        copyId: 'C1-06',
        accessionNumber: 'KPRIET-CSE-B001-06',
        isAvailable: false,
        issuedTo: { rollNo: '711122104089', name: 'Vignesh P', dueDate: '2026-08-29', issueDate: '2026-08-15' },
        condition: 'Excellent'
      }
    ]
  },
  {
    id: 'book-2',
    accessionNo: 'KPRIET-CSE-B002',
    title: 'Operating System Concepts (Silberschatz Dinosaur Book)',
    author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
    isbn: '978-1119800361',
    publisher: 'Wiley Global Education',
    edition: '10th Edition',
    year: 2021,
    category: 'Operating Systems & System Software',
    subjectCode: 'CS3451',
    subjectName: 'Operating Systems',
    semester: 4,
    totalCopies: 5,
    availableCopies: 2,
    rackLocation: 'Rack CSE-02, Shelf B',
    rackId: 'CSE-02',
    description: 'Fundamental processes, threads, synchronization, CPU scheduling, memory management, virtual memory, and distributed OS architectures.',
    tags: ['OS', 'Processes', 'Threads', 'Memory Management', 'Deadlocks'],
    coverGradient: 'from-blue-600 to-indigo-900',
    copies: [
      { copyId: 'C2-01', accessionNumber: 'KPRIET-CSE-B002-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C2-02', accessionNumber: 'KPRIET-CSE-B002-02', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C2-03',
        accessionNumber: 'KPRIET-CSE-B002-03',
        isAvailable: false,
        issuedTo: { rollNo: '711122104011', name: 'Abishek M', dueDate: '2026-09-05', issueDate: '2026-08-22' },
        condition: 'Good'
      },
      {
        copyId: 'C2-04',
        accessionNumber: 'KPRIET-CSE-B002-04',
        isAvailable: false,
        issuedTo: { rollNo: '711122104065', name: 'Sowndharya V', dueDate: '2026-08-18', issueDate: '2026-08-04' }, // Overdue!
        condition: 'Good'
      },
      {
        copyId: 'C2-05',
        accessionNumber: 'KPRIET-CSE-B002-05',
        isAvailable: false,
        issuedTo: { rollNo: 'FAC-CSE-014', name: 'Dr. S. Karthi (Asst Prof)', dueDate: '2026-09-15', issueDate: '2026-08-16' },
        condition: 'Excellent'
      }
    ]
  },
  {
    id: 'book-3',
    accessionNo: 'KPRIET-CSE-B003',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    isbn: '978-0078022159',
    publisher: 'McGraw Hill Education',
    edition: '7th Edition',
    year: 2020,
    category: 'Database Management Systems',
    subjectCode: 'CS3452',
    subjectName: 'Database Management Systems',
    semester: 4,
    totalCopies: 6,
    availableCopies: 4,
    rackLocation: 'Rack CSE-02, Shelf A',
    rackId: 'CSE-02',
    description: 'Relational model, SQL, normalization (1NF-BCNF), transaction processing, concurrency control, ACID properties, NoSQL, and indexing.',
    tags: ['DBMS', 'SQL', 'Normalization', 'Transactions', 'NoSQL', 'Indexing'],
    coverGradient: 'from-emerald-600 to-teal-900',
    copies: [
      { copyId: 'C3-01', accessionNumber: 'KPRIET-CSE-B003-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C3-02', accessionNumber: 'KPRIET-CSE-B003-02', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C3-03', accessionNumber: 'KPRIET-CSE-B003-03', isAvailable: true, condition: 'Good' },
      { copyId: 'C3-04', accessionNumber: 'KPRIET-CSE-B003-04', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C3-05',
        accessionNumber: 'KPRIET-CSE-B003-05',
        isAvailable: false,
        issuedTo: { rollNo: '711122104033', name: 'Keerthana M', dueDate: '2026-09-01', issueDate: '2026-08-18' },
        condition: 'Good'
      },
      {
        copyId: 'C3-06',
        accessionNumber: 'KPRIET-CSE-B003-06',
        isAvailable: false,
        issuedTo: { rollNo: '711122104077', name: 'Surya Narayanan', dueDate: '2026-08-30', issueDate: '2026-08-16' },
        condition: 'Good'
      }
    ]
  },
  {
    id: 'book-4',
    accessionNo: 'KPRIET-CSE-B004',
    title: 'Computer Networks: A Systems Approach',
    author: 'Larry L. Peterson, Bruce S. Davie',
    isbn: '978-0128182000',
    publisher: 'Morgan Kaufmann / Elsevier',
    edition: '6th Edition',
    year: 2021,
    category: 'Computer Networks & Security',
    subjectCode: 'CS3591',
    subjectName: 'Computer Networks',
    semester: 5,
    totalCopies: 4,
    availableCopies: 1,
    rackLocation: 'Rack CSE-03, Shelf A',
    rackId: 'CSE-03',
    description: 'Protocol layers, routing algorithms (OSPF, BGP), TCP flow & congestion control, socket programming, DNS, and HTTP/HTTPS architecture.',
    tags: ['Networks', 'TCP/IP', 'Routing', 'Sockets', 'Security'],
    coverGradient: 'from-cyan-600 to-blue-900',
    copies: [
      { copyId: 'C4-01', accessionNumber: 'KPRIET-CSE-B004-01', isAvailable: true, condition: 'Excellent' },
      {
        copyId: 'C4-02',
        accessionNumber: 'KPRIET-CSE-B004-02',
        isAvailable: false,
        issuedTo: { rollNo: '711121104005', name: 'Aravind Swamy B', dueDate: '2026-09-04', issueDate: '2026-08-21' },
        condition: 'Good'
      },
      {
        copyId: 'C4-03',
        accessionNumber: 'KPRIET-CSE-B004-03',
        isAvailable: false,
        issuedTo: { rollNo: '711121104054', name: 'Praveen S', dueDate: '2026-08-28', issueDate: '2026-08-14' },
        condition: 'Good'
      },
      {
        copyId: 'C4-04',
        accessionNumber: 'KPRIET-CSE-B004-04',
        isAvailable: false,
        issuedTo: { rollNo: '711121104092', name: 'Yogeshwaran K', dueDate: '2026-09-06', issueDate: '2026-08-23' },
        condition: 'Excellent'
      }
    ]
  },
  {
    id: 'book-5',
    accessionNo: 'KPRIET-CSE-B005',
    title: 'Artificial Intelligence: A Modern Approach (AIMA)',
    author: 'Stuart Russell, Peter Norvig',
    isbn: '978-0134610993',
    publisher: 'Pearson Education',
    edition: '4th Global Edition',
    year: 2022,
    category: 'Artificial Intelligence & Machine Learning',
    subjectCode: 'AL3452',
    subjectName: 'Artificial Intelligence and Machine Learning',
    semester: 5,
    totalCopies: 5,
    availableCopies: 0, // All copies issued - Great for testing Reservation!
    rackLocation: 'Rack CSE-04, Shelf A',
    rackId: 'CSE-04',
    description: 'The standard definitive guide to intelligent agents, informed search (A*), constraint satisfaction, knowledge representation, probabilistic reasoning, and deep reinforcement learning.',
    tags: ['AI', 'Search', 'Machine Learning', 'Probabilistic Reasoning', 'Neural Nets'],
    coverGradient: 'from-purple-600 to-pink-900',
    copies: [
      {
        copyId: 'C5-01',
        accessionNumber: 'KPRIET-CSE-B005-01',
        isAvailable: false,
        issuedTo: { rollNo: '711121104015', name: 'Deepika R', dueDate: '2026-09-02', issueDate: '2026-08-19' },
        condition: 'Excellent'
      },
      {
        copyId: 'C5-02',
        accessionNumber: 'KPRIET-CSE-B005-02',
        isAvailable: false,
        issuedTo: { rollNo: '711121104040', name: 'Manojkumar T', dueDate: '2026-08-31', issueDate: '2026-08-17' },
        condition: 'Good'
      },
      {
        copyId: 'C5-03',
        accessionNumber: 'KPRIET-CSE-B005-03',
        isAvailable: false,
        issuedTo: { rollNo: '711121104071', name: 'Shalini S', dueDate: '2026-09-07', issueDate: '2026-08-24' },
        condition: 'Good'
      },
      {
        copyId: 'C5-04',
        accessionNumber: 'KPRIET-CSE-B005-04',
        isAvailable: false,
        issuedTo: { rollNo: '711122104002', name: 'Aadhirai G', dueDate: '2026-08-22', issueDate: '2026-08-08' }, // Overdue!
        condition: 'Good'
      },
      {
        copyId: 'C5-05',
        accessionNumber: 'KPRIET-CSE-B005-05',
        isAvailable: false,
        issuedTo: { rollNo: 'FAC-CSE-002', name: 'Prof. Anusuya N T', dueDate: '2026-09-20', issueDate: '2026-08-20' },
        condition: 'Excellent'
      }
    ]
  },
  {
    id: 'book-6',
    accessionNo: 'KPRIET-CSE-B006',
    title: 'Compilers: Principles, Techniques, & Tools (The Dragon Book)',
    author: 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman',
    isbn: '978-0321486813',
    publisher: 'Pearson Addison-Wesley',
    edition: '2nd Edition',
    year: 2019,
    category: 'Theory of Computation & Compiler Design',
    subjectCode: 'CS3501',
    subjectName: 'Compiler Design',
    semester: 5,
    totalCopies: 4,
    availableCopies: 3,
    rackLocation: 'Rack CSE-05, Shelf A',
    rackId: 'CSE-05',
    description: 'Lexical analysis, syntax analysis (LL, LR parsers), syntax-directed translation, type checking, intermediate code generation, and runtime storage management.',
    tags: ['Compilers', 'Lex & Yacc', 'Parsers', 'Code Optimization', 'Dragon Book'],
    coverGradient: 'from-orange-600 to-amber-900',
    copies: [
      { copyId: 'C6-01', accessionNumber: 'KPRIET-CSE-B006-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C6-02', accessionNumber: 'KPRIET-CSE-B006-02', isAvailable: true, condition: 'Good' },
      { copyId: 'C6-03', accessionNumber: 'KPRIET-CSE-B006-03', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C6-04',
        accessionNumber: 'KPRIET-CSE-B006-04',
        isAvailable: false,
        issuedTo: { rollNo: '711121104084', name: 'Vijay Anand K', dueDate: '2026-09-03', issueDate: '2026-08-20' },
        condition: 'Good'
      }
    ]
  },
  {
    id: 'book-7',
    accessionNo: 'KPRIET-CSE-B007',
    title: 'Introduction to the Theory of Computation',
    author: 'Michael Sipser',
    isbn: '978-1133187790',
    publisher: 'Cengage Learning',
    edition: '3rd Edition',
    year: 2020,
    category: 'Theory of Computation & Compiler Design',
    subjectCode: 'CS3401',
    subjectName: 'Theory of Computation',
    semester: 4,
    totalCopies: 4,
    availableCopies: 2,
    rackLocation: 'Rack CSE-05, Shelf B',
    rackId: 'CSE-05',
    description: 'Automata theory, regular expressions, context-free grammars, Pushdown Automata, Turing machines, decidability, and computational complexity (P vs NP).',
    tags: ['Automata', 'Turing Machines', 'Complexity', 'Formal Languages'],
    coverGradient: 'from-violet-600 to-indigo-950',
    copies: [
      { copyId: 'C7-01', accessionNumber: 'KPRIET-CSE-B007-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C7-02', accessionNumber: 'KPRIET-CSE-B007-02', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C7-03',
        accessionNumber: 'KPRIET-CSE-B007-03',
        isAvailable: false,
        issuedTo: { rollNo: '711122104022', name: 'Dharani M', dueDate: '2026-09-02', issueDate: '2026-08-19' },
        condition: 'Good'
      },
      {
        copyId: 'C7-04',
        accessionNumber: 'KPRIET-CSE-B007-04',
        isAvailable: false,
        issuedTo: { rollNo: '711122104058', name: 'Saravanan S', dueDate: '2026-08-30', issueDate: '2026-08-16' },
        condition: 'Good'
      }
    ]
  },
  {
    id: 'book-8',
    accessionNo: 'KPRIET-CSE-B008',
    title: 'Computer Organization and Design: RISC-V Edition',
    author: 'David A. Patterson, John L. Hennessy',
    isbn: '978-0128122754',
    publisher: 'Morgan Kaufmann / Elsevier',
    edition: '2nd Edition',
    year: 2021,
    category: 'Computer Architecture & Microprocessors',
    subjectCode: 'CS3352',
    subjectName: 'Computer Organization and Architecture',
    semester: 3,
    totalCopies: 5,
    availableCopies: 3,
    rackLocation: 'Rack CSE-01, Shelf B',
    rackId: 'CSE-01',
    description: 'Hardware/software interface, instruction sets, RISC-V pipeline design, hazards, cache memory hierarchies, and parallel processors.',
    tags: ['Architecture', 'RISC-V', 'Pipelining', 'Memory Hierarchy', 'Hardware'],
    coverGradient: 'from-emerald-700 to-slate-900',
    copies: [
      { copyId: 'C8-01', accessionNumber: 'KPRIET-CSE-B008-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C8-02', accessionNumber: 'KPRIET-CSE-B008-02', isAvailable: true, condition: 'Good' },
      { copyId: 'C8-03', accessionNumber: 'KPRIET-CSE-B008-03', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C8-04',
        accessionNumber: 'KPRIET-CSE-B008-04',
        isAvailable: false,
        issuedTo: { rollNo: '711123104044', name: 'Karthikeyan B', dueDate: '2026-09-01', issueDate: '2026-08-18' },
        condition: 'Good'
      },
      {
        copyId: 'C8-05',
        accessionNumber: 'KPRIET-CSE-B008-05',
        isAvailable: false,
        issuedTo: { rollNo: '711123104080', name: 'Swetha R', dueDate: '2026-09-05', issueDate: '2026-08-22' },
        condition: 'Excellent'
      }
    ]
  },
  {
    id: 'book-9',
    accessionNo: 'KPRIET-CSE-B009',
    title: 'Cryptography and Network Security: Principles and Practice',
    author: 'William Stallings',
    isbn: '978-0135764039',
    publisher: 'Pearson',
    edition: '8th Edition',
    year: 2022,
    category: 'Computer Networks & Security',
    subjectCode: 'CS3691',
    subjectName: 'Cyber Security and Cryptography',
    semester: 6,
    totalCopies: 4,
    availableCopies: 2,
    rackLocation: 'Rack CSE-03, Shelf B',
    rackId: 'CSE-03',
    description: 'Symmetric encryption (AES, DES), public key cryptography (RSA, ECC), SHA-3, digital signatures, SSL/TLS, firewalls, and blockchain basics.',
    tags: ['Security', 'AES', 'RSA', 'TLS', 'Cyber Security', 'Cryptography'],
    coverGradient: 'from-rose-600 to-zinc-900',
    copies: [
      { copyId: 'C9-01', accessionNumber: 'KPRIET-CSE-B009-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C9-02', accessionNumber: 'KPRIET-CSE-B009-02', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C9-03',
        accessionNumber: 'KPRIET-CSE-B009-03',
        isAvailable: false,
        issuedTo: { rollNo: '711121104029', name: 'Gokulnath P', dueDate: '2026-09-03', issueDate: '2026-08-20' },
        condition: 'Good'
      },
      {
        copyId: 'C9-04',
        accessionNumber: 'KPRIET-CSE-B009-04',
        isAvailable: false,
        issuedTo: { rollNo: '711121104066', name: 'Sneha Mohan', dueDate: '2026-08-25', issueDate: '2026-08-11' }, // Due soon!
        condition: 'Good'
      }
    ]
  },
  {
    id: 'book-10',
    accessionNo: 'KPRIET-CSE-B010',
    title: 'Mastering Cloud Computing: Foundations and Applications',
    author: 'Rajkumar Buyya, Christian Vecchiola, S. Thamarai Selvi',
    isbn: '978-0124114548',
    publisher: 'Morgan Kaufmann / McGraw Hill',
    edition: '1st Edition (Reprint 2022)',
    year: 2022,
    category: 'Cloud Computing & Distributed Systems',
    subjectCode: 'CS3551',
    subjectName: 'Cloud Computing and Virtualization',
    semester: 6,
    totalCopies: 4,
    availableCopies: 3,
    rackLocation: 'Rack CSE-06, Shelf A',
    rackId: 'CSE-06',
    description: 'Virtualization architectures (KVM, Xen), IaaS, PaaS, SaaS models, cloud resource provisioning, SLA management, and AWS/Azure deployment.',
    tags: ['Cloud', 'Virtualization', 'AWS', 'Distributed Systems', 'Docker'],
    coverGradient: 'from-sky-600 to-indigo-900',
    copies: [
      { copyId: 'C10-01', accessionNumber: 'KPRIET-CSE-B010-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C10-02', accessionNumber: 'KPRIET-CSE-B010-02', isAvailable: true, condition: 'Good' },
      { copyId: 'C10-03', accessionNumber: 'KPRIET-CSE-B010-03', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C10-04',
        accessionNumber: 'KPRIET-CSE-B010-04',
        isAvailable: false,
        issuedTo: { rollNo: '711121104037', name: 'Kaviyarasu M', dueDate: '2026-09-02', issueDate: '2026-08-19' },
        condition: 'Good'
      }
    ]
  },
  {
    id: 'book-11',
    accessionNo: 'KPRIET-CSE-B011',
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    isbn: '978-0262035613',
    publisher: 'MIT Press',
    edition: '1st Edition',
    year: 2021,
    category: 'Artificial Intelligence & Machine Learning',
    subjectCode: 'CCS341',
    subjectName: 'Deep Learning and Neural Networks',
    semester: 'Elective',
    totalCopies: 3,
    availableCopies: 1,
    rackLocation: 'Rack CSE-04, Shelf B',
    rackId: 'CSE-04',
    description: 'Deep feedforward networks, regularization, optimization algorithms, Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), and GANs.',
    tags: ['Deep Learning', 'Neural Networks', 'CNN', 'Transformers', 'PyTorch'],
    coverGradient: 'from-fuchsia-600 to-purple-950',
    copies: [
      { copyId: 'C11-01', accessionNumber: 'KPRIET-CSE-B011-01', isAvailable: true, condition: 'Excellent' },
      {
        copyId: 'C11-02',
        accessionNumber: 'KPRIET-CSE-B011-02',
        isAvailable: false,
        issuedTo: { rollNo: '711121104018', name: 'Dinesh Kumar S', dueDate: '2026-09-04', issueDate: '2026-08-21' },
        condition: 'Excellent'
      },
      {
        copyId: 'C11-03',
        accessionNumber: 'KPRIET-CSE-B011-03',
        isAvailable: false,
        issuedTo: { rollNo: '711121104059', name: 'Raghavan R', dueDate: '2026-08-19', issueDate: '2026-08-05' }, // Overdue!
        condition: 'Good'
      }
    ]
  },
  {
    id: 'book-12',
    accessionNo: 'KPRIET-CSE-B012',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    isbn: '978-1259676512',
    publisher: 'McGraw Hill',
    edition: '8th Edition',
    year: 2020,
    category: 'Mathematics & Discrete Structures',
    subjectCode: 'MA3354',
    subjectName: 'Discrete Mathematics for Computer Science',
    semester: 3,
    totalCopies: 5,
    availableCopies: 4,
    rackLocation: 'Rack CSE-07, Shelf A',
    rackId: 'CSE-07',
    description: 'Propositional logic, predicate calculus, mathematical induction, recurrence relations, graph theory, trees, algebraic structures, and groups.',
    tags: ['Discrete Math', 'Logic', 'Graph Theory', 'Combinatorics', 'Recurrence'],
    coverGradient: 'from-teal-600 to-slate-900',
    copies: [
      { copyId: 'C12-01', accessionNumber: 'KPRIET-CSE-B012-01', isAvailable: true, condition: 'Excellent' },
      { copyId: 'C12-02', accessionNumber: 'KPRIET-CSE-B012-02', isAvailable: true, condition: 'Good' },
      { copyId: 'C12-03', accessionNumber: 'KPRIET-CSE-B012-03', isAvailable: true, condition: 'Good' },
      { copyId: 'C12-04', accessionNumber: 'KPRIET-CSE-B012-04', isAvailable: true, condition: 'Good' },
      {
        copyId: 'C12-05',
        accessionNumber: 'KPRIET-CSE-B012-05',
        isAvailable: false,
        issuedTo: { rollNo: '711123104012', name: 'Bhavadharani M', dueDate: '2026-09-06', issueDate: '2026-08-23' },
        condition: 'Good'
      }
    ]
  }
];

export const INITIAL_ISSUES: IssueRecord[] = [
  {
    id: 'issue-1',
    transactionId: 'TX-2026-0801',
    bookId: 'book-1',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    bookAuthor: 'Thomas H. Cormen et al.',
    accessionNo: 'KPRIET-CSE-B001',
    copyId: 'C1-04',
    borrowerName: 'Naveen Kumar R',
    borrowerRollNo: '711122104042',
    borrowerType: 'student',
    borrowerDepartment: 'CSE',
    borrowerYearSection: 'III Year CSE-A',
    borrowerEmail: 'naveen.711122104042@kpriet.ac.in',
    borrowerPhone: '+91 98421 11042',
    issueDate: '2026-08-19',
    dueDate: '2026-09-02',
    status: 'active',
    renewalCount: 0,
    fineAmount: 0,
    finePaid: false,
    issuedBy: 'Librarian (Mrs. Karpagam)'
  },
  {
    id: 'issue-2',
    transactionId: 'TX-2026-0802',
    bookId: 'book-1',
    bookTitle: 'Introduction to Algorithms (CLRS)',
    bookAuthor: 'Thomas H. Cormen et al.',
    accessionNo: 'KPRIET-CSE-B001',
    copyId: 'C1-05',
    borrowerName: 'Harini S',
    borrowerRollNo: '711123104018',
    borrowerType: 'student',
    borrowerDepartment: 'CSE',
    borrowerYearSection: 'II Year CSE-B',
    borrowerEmail: 'harini.711123104018@kpriet.ac.in',
    borrowerPhone: '+91 97890 55418',
    issueDate: '2026-08-06',
    dueDate: '2026-08-20',
    status: 'overdue',
    renewalCount: 0,
    fineAmount: 8, // 4 days overdue * Rs 2
    finePaid: false,
    remarks: 'Reminder email sent to student',
    issuedBy: 'Librarian (Mrs. Karpagam)'
  },
  {
    id: 'issue-3',
    transactionId: 'TX-2026-0803',
    bookId: 'book-2',
    bookTitle: 'Operating System Concepts (Silberschatz Dinosaur Book)',
    bookAuthor: 'Abraham Silberschatz et al.',
    accessionNo: 'KPRIET-CSE-B002',
    copyId: 'C2-04',
    borrowerName: 'Sowndharya V',
    borrowerRollNo: '711122104065',
    borrowerType: 'student',
    borrowerDepartment: 'CSE',
    borrowerYearSection: 'III Year CSE-B',
    borrowerEmail: 'sowndharya.711122104065@kpriet.ac.in',
    borrowerPhone: '+91 94432 88065',
    issueDate: '2026-08-04',
    dueDate: '2026-08-18',
    status: 'overdue',
    renewalCount: 0,
    fineAmount: 12, // 6 days overdue
    finePaid: false,
    issuedBy: 'Staff In-charge'
  },
  {
    id: 'issue-4',
    transactionId: 'TX-2026-0804',
    bookId: 'book-5',
    bookTitle: 'Artificial Intelligence: A Modern Approach (AIMA)',
    bookAuthor: 'Stuart Russell, Peter Norvig',
    accessionNo: 'KPRIET-CSE-B005',
    copyId: 'C5-05',
    borrowerName: 'Prof. Anusuya N T',
    borrowerRollNo: 'FAC-CSE-002',
    borrowerType: 'faculty',
    borrowerDepartment: 'CSE',
    borrowerYearSection: 'Faculty - CSE Dept',
    borrowerEmail: 'anusuya.nt969@kpriet.ac.in',
    borrowerPhone: '+91 98421 99002',
    issueDate: '2026-08-20',
    dueDate: '2026-09-20',
    status: 'active',
    renewalCount: 0,
    fineAmount: 0,
    finePaid: false,
    issuedBy: 'Librarian (Mrs. Karpagam)'
  },
  {
    id: 'issue-5',
    transactionId: 'TX-2026-0805',
    bookId: 'book-11',
    bookTitle: 'Deep Learning',
    bookAuthor: 'Ian Goodfellow et al.',
    accessionNo: 'KPRIET-CSE-B011',
    copyId: 'C11-03',
    borrowerName: 'Raghavan R',
    borrowerRollNo: '711121104059',
    borrowerType: 'student',
    borrowerDepartment: 'CSE',
    borrowerYearSection: 'IV Year CSE-A',
    borrowerEmail: 'raghavan.711121104059@kpriet.ac.in',
    borrowerPhone: '+91 90034 12059',
    issueDate: '2026-08-05',
    dueDate: '2026-08-19',
    status: 'overdue',
    renewalCount: 0,
    fineAmount: 10,
    finePaid: false,
    issuedBy: 'Librarian (Mrs. Karpagam)'
  },
  {
    id: 'issue-6',
    transactionId: 'TX-2026-0780',
    bookId: 'book-3',
    bookTitle: 'Database System Concepts',
    bookAuthor: 'Silberschatz, Korth, Sudarshan',
    accessionNo: 'KPRIET-CSE-B003',
    copyId: 'C3-01',
    borrowerName: 'Mithun Chakravarthy',
    borrowerRollNo: '711122104038',
    borrowerType: 'student',
    borrowerDepartment: 'CSE',
    borrowerYearSection: 'III Year CSE-A',
    borrowerEmail: 'mithun.711122104038@kpriet.ac.in',
    borrowerPhone: '+91 98433 77038',
    issueDate: '2026-08-01',
    dueDate: '2026-08-15',
    returnDate: '2026-08-14',
    status: 'returned',
    renewalCount: 0,
    fineAmount: 0,
    finePaid: true,
    conditionOnReturn: 'Good',
    remarks: 'Returned in time without penalty.',
    issuedBy: 'Librarian (Mrs. Karpagam)'
  }
];

export const INITIAL_RESERVATIONS: ReservationRecord[] = [
  {
    id: 'res-1',
    bookId: 'book-5',
    bookTitle: 'Artificial Intelligence: A Modern Approach (AIMA)',
    accessionNo: 'KPRIET-CSE-B005',
    studentName: 'Karthik Raja S',
    rollNo: '711122104030',
    email: 'karthik.711122104030@kpriet.ac.in',
    phone: '+91 98422 30030',
    reservationDate: '2026-08-22',
    status: 'waiting',
    priorityOrder: 1
  }
];

export const RACK_LAYOUT = [
  {
    id: 'CSE-01',
    name: 'Rack CSE-01',
    section: 'Block II - East Wing',
    category: 'Data Structures, Algorithms & Architecture',
    color: 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200',
    shelfCount: 4,
    subjects: ['CS3351', 'CS3352', 'CS3251']
  },
  {
    id: 'CSE-02',
    name: 'Rack CSE-02',
    section: 'Block II - East Wing',
    category: 'Operating Systems & Database Management',
    color: 'border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-200',
    shelfCount: 4,
    subjects: ['CS3451', 'CS3452']
  },
  {
    id: 'CSE-03',
    name: 'Rack CSE-03',
    section: 'Block II - Central Bay',
    category: 'Computer Networks & Cyber Security',
    color: 'border-cyan-500 bg-cyan-500/10 text-cyan-900 dark:text-cyan-200',
    shelfCount: 4,
    subjects: ['CS3591', 'CS3691']
  },
  {
    id: 'CSE-04',
    name: 'Rack CSE-04',
    section: 'Block II - Central Bay',
    category: 'AI, Machine Learning & Data Science',
    color: 'border-purple-500 bg-purple-500/10 text-purple-900 dark:text-purple-200',
    shelfCount: 4,
    subjects: ['AL3452', 'CCS341', 'AD3351']
  },
  {
    id: 'CSE-05',
    name: 'Rack CSE-05',
    section: 'Block II - West Wing',
    category: 'Theory of Computation & Compiler Design',
    color: 'border-orange-500 bg-orange-500/10 text-orange-900 dark:text-orange-200',
    shelfCount: 4,
    subjects: ['CS3401', 'CS3501']
  },
  {
    id: 'CSE-06',
    name: 'Rack CSE-06',
    section: 'Block II - West Wing',
    category: 'Cloud Computing, DevOps & Distributed Systems',
    color: 'border-sky-500 bg-sky-500/10 text-sky-900 dark:text-sky-200',
    shelfCount: 4,
    subjects: ['CS3551', 'CCS335']
  },
  {
    id: 'CSE-07',
    name: 'Rack CSE-07',
    section: 'Block II - South Wing',
    category: 'Discrete Mathematics & Graph Theory',
    color: 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200',
    shelfCount: 4,
    subjects: ['MA3354', 'MA3151']
  },
  {
    id: 'CSE-08',
    name: 'Rack CSE-08',
    section: 'Block II - South Wing (Reference)',
    category: 'Final Year Project Thesis & IEEE Journals Archive',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
    shelfCount: 4,
    subjects: ['PROJECT-REF', 'IEEE-ARCHIVE']
  }
];

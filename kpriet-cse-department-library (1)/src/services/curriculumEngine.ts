/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * KPRIET CSE Department Library Academic Knowledge Engine & Curriculum Advisor
 */

import { Book } from '../types';

export interface CurriculumSubject {
  code: string;
  name: string;
  semester: number | string;
  category: string;
  primaryTextbook: string;
  authors: string;
  referenceBooks: string[];
  rackLocation: string;
  rackId: string;
  gateRelevance: string;
  keyTopics: string[];
}

export const KPRIET_CSE_CURRICULUM: CurriculumSubject[] = [
  {
    code: 'CS3351',
    name: 'Data Structures and Algorithms',
    semester: 3,
    category: 'Data Structures & Algorithms',
    primaryTextbook: 'Introduction to Algorithms (4th Edition)',
    authors: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein (CLRS)',
    referenceBooks: [
      'Data Structures and Algorithm Analysis in C++ (Mark Allen Weiss)',
      'Algorithms (Robert Sedgewick & Kevin Wayne)',
      'Fundamentals of Data Structures in C (Ellis Horowitz, Sartaj Sahni)',
    ],
    rackLocation: 'Rack CSE-01 (Shelf A & B)',
    rackId: 'CSE-01',
    gateRelevance: 'Very High (15-18% of GATE CSE score: Asymptotic analysis, Trees, Graphs, Sorting, DP, Greedy)',
    keyTopics: ['Linear Lists, Stacks, Queues', 'Trees, AVL, B-Trees, Red-Black Trees', 'Hashing, Priority Queues', 'Graph Algorithms (BFS, DFS, Dijkstra, Kruskal)', 'Dynamic Programming, Divide & Conquer'],
  },
  {
    code: 'CS3451',
    name: 'Operating Systems',
    semester: 4,
    category: 'Operating Systems & System Software',
    primaryTextbook: 'Operating System Concepts (10th Edition - Dinosaur Book)',
    authors: 'Abraham Silberschatz, Peter Baer Galvin, Greg Gagne',
    referenceBooks: [
      'Modern Operating Systems (Andrew S. Tanenbaum & Herbert Bos)',
      'Operating Systems: Internals and Design Principles (William Stallings)',
      'Operating Systems: Three Easy Pieces (Remzi Arpaci-Dusseau)',
    ],
    rackLocation: 'Rack CSE-02 (Shelf B)',
    rackId: 'CSE-02',
    gateRelevance: 'High (8-10% of GATE CSE: CPU Scheduling, Synchronization & Semaphores, Deadlocks, Paging, Virtual Memory, Disk Scheduling)',
    keyTopics: ['Processes, Threads & CPU Scheduling', 'Process Synchronization, Mutex, Semaphores', 'Deadlock Detection & Prevention (Banker\'s Algorithm)', 'Memory Management, Paging, Segmentation, Page Replacement', 'File Systems, I/O & Disk Scheduling'],
  },
  {
    code: 'CS3452',
    name: 'Database Management Systems',
    semester: 4,
    category: 'Database Management Systems',
    primaryTextbook: 'Database System Concepts (7th Edition)',
    authors: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
    referenceBooks: [
      'Fundamentals of Database Systems (Ramez Elmasri, Shamkant B. Navathe)',
      'Database Management Systems (Raghu Ramakrishnan, Johannes Gehrke)',
      'SQL & Relational Theory (C.J. Date)',
    ],
    rackLocation: 'Rack CSE-02 (Shelf A)',
    rackId: 'CSE-02',
    gateRelevance: 'High (7-9% of GATE CSE: ER Model, Relational Algebra, SQL, Normalization BCNF/3NF, Transactions & ACID, Indexing B+ Trees)',
    keyTopics: ['ER Modeling & Relational Schema', 'Relational Algebra & Advanced SQL Queries', 'Functional Dependencies & Normal Forms (1NF, 2NF, 3NF, BCNF)', 'Transaction Processing, ACID Properties, Concurrency Control (2PL)', 'Indexing, B-Trees, B+ Trees, Query Optimization'],
  },
  {
    code: 'CS3591',
    name: 'Computer Networks',
    semester: 5,
    category: 'Computer Networks & Security',
    primaryTextbook: 'Computer Networking: A Top-Down Approach (8th Edition)',
    authors: 'James F. Kurose, Keith W. Ross',
    referenceBooks: [
      'Computer Networks (Andrew S. Tanenbaum, Nick Feamster, David Wetherall)',
      'Data Communications and Networking (Behrouz A. Forouzan)',
      'TCP/IP Illustrated (W. Richard Stevens)',
    ],
    rackLocation: 'Rack CSE-03 (Shelf A)',
    rackId: 'CSE-03',
    gateRelevance: 'High (8-10% of GATE CSE: OSI & TCP/IP stack, Flow Control Sliding Window, IP Subnetting & CIDR, Routing Protocols, TCP Congestion Control, DNS/HTTP)',
    keyTopics: ['Application Layer Protocols (HTTP, DNS, SMTP, FTP)', 'Transport Layer (TCP vs UDP, Flow Control, Congestion Control)', 'Network Layer (IPv4/IPv6, CIDR Subnetting, OSPF, BGP, RIP)', 'Data Link Layer (Framing, Error Detection, Sliding Window, CSMA/CD)', 'Network Security basics (RSA, TLS/SSL, Firewalls)'],
  },
  {
    code: 'AL3452',
    name: 'Artificial Intelligence & Machine Learning',
    semester: 4,
    category: 'Artificial Intelligence & Machine Learning',
    primaryTextbook: 'Artificial Intelligence: A Modern Approach (4th Edition)',
    authors: 'Stuart Russell, Peter Norvig',
    referenceBooks: [
      'Pattern Recognition and Machine Learning (Christopher M. Bishop)',
      'Machine Learning (Tom M. Mitchell)',
      'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (Aurélien Géron)',
    ],
    rackLocation: 'Rack CSE-04 (Shelf A)',
    rackId: 'CSE-04',
    gateRelevance: 'Moderate to High in GATE DA & CSE (Informed/Uninformed Search, A*, Game Playing Minimax, Supervised Learning, Neural Networks)',
    keyTopics: ['Intelligent Agents & Problem Formulation', 'Search Algorithms (BFS, DFS, A*, Heuristics, Alpha-Beta Pruning)', 'Knowledge Representation, First-Order Logic, Propositional Logic', 'Supervised Learning (Regression, Decision Trees, SVM, Random Forests)', 'Unsupervised Learning, Clustering, Neural Networks basics'],
  },
  {
    code: 'CS3501',
    name: 'Compiler Design',
    semester: 5,
    category: 'Theory of Computation & Compiler Design',
    primaryTextbook: 'Compilers: Principles, Techniques, and Tools (Dragon Book)',
    authors: 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman',
    referenceBooks: [
      'Engineering a Compiler (Keith D. Cooper, Linda Torczon)',
      'Modern Compiler Implementation in C (Andrew W. Appel)',
    ],
    rackLocation: 'Rack CSE-05 (Shelf A)',
    rackId: 'CSE-05',
    gateRelevance: 'Medium (5-7% of GATE CSE: Lexical Analysis, LL(1) / LR Parsers, Syntax Directed Translation, Intermediate Code Generation, DAGs, Code Optimization)',
    keyTopics: ['Phases of a Compiler, Lexical Analysis, Flex/Lex', 'Syntax Analysis, Context-Free Grammars, LL(1), SLR, CLR, LALR Parsers', 'Syntax-Directed Translation & Attribute Grammars', 'Intermediate Code Generation (Three-Address Code, Quadruples)', 'Code Optimization (Loop Invariants, Common Subexpression Elimination)'],
  },
  {
    code: 'CS3551',
    name: 'Distributed Computing and Cloud Services',
    semester: 5,
    category: 'Cloud Computing & Distributed Systems',
    primaryTextbook: 'Cloud Computing: Concepts, Technology & Architecture',
    authors: 'Thomas Erl, Ricardo Puttini, Zaigham Mahmood',
    referenceBooks: [
      'Distributed Systems: Principles and Paradigms (Andrew S. Tanenbaum & Maarten van Steen)',
      'Designing Data-Intensive Applications (Martin Kleppmann)',
      'Cloud Application Architectures (George Reese)',
    ],
    rackLocation: 'Rack CSE-06 (Shelf A)',
    rackId: 'CSE-06',
    gateRelevance: 'Emerging & Specialization Topic (Distributed Consensus, CAP Theorem, Virtualization, Containers, Microservices)',
    keyTopics: ['Cloud Service Models (IaaS, PaaS, SaaS) & Deployment Models', 'Virtualization, Hypervisors, Containers (Docker, Kubernetes)', 'Distributed Storage, MapReduce, Hadoop, Spark', 'CAP Theorem, Eventual Consistency, Paxos/Raft Consensus', 'Cloud Security, SLA Management, Serverless Architecture'],
  },
  {
    code: 'MA3354',
    name: 'Discrete Mathematics',
    semester: 3,
    category: 'Mathematics & Discrete Structures',
    primaryTextbook: 'Discrete Mathematics and Its Applications (8th Edition)',
    authors: 'Kenneth H. Rosen',
    referenceBooks: [
      'Discrete Mathematical Structures (Bernard Kolman, Robert Busby, Sharon C. Ross)',
      'Elements of Discrete Mathematics (C.L. Liu)',
      'Concrete Mathematics (Ronald L. Graham, Donald E. Knuth, Oren Patashnik)',
    ],
    rackLocation: 'Rack CSE-07 (Shelf A)',
    rackId: 'CSE-07',
    gateRelevance: 'Very High (10-12% of GATE CSE: Propositional & First Order Logic, Sets, Relations, Functions, Partial Orders & Lattices, Groups, Graph Theory, Combinatorics)',
    keyTopics: ['Mathematical Logic & Proof Methods', 'Set Theory, Relations, Equivalence, Posets, Hasse Diagrams', 'Combinatorics, Permutations, Pigeonhole Principle, Recurrence Relations', 'Graph Theory (Euler/Hamiltonian paths, Planar graphs, Graph Coloring)', 'Algebraic Structures (Groups, Subgroups, Monoids, Rings)'],
  },
  {
    code: 'CS3391',
    name: 'Object Oriented Programming',
    semester: 3,
    category: 'Computer Architecture & Microprocessors',
    primaryTextbook: 'Java: The Complete Reference (12th Edition)',
    authors: 'Herbert Schildt',
    referenceBooks: [
      'Effective Java (Joshua Bloch)',
      'Head First Java (Kathy Sierra & Bert Bates)',
      'Core Java Volume I--Fundamentals (Cay S. Horstmann)',
    ],
    rackLocation: 'Rack CSE-01 (Shelf C)',
    rackId: 'CSE-01',
    gateRelevance: 'Programming Foundations (Encapsulation, Inheritance, Polymorphism, Exception Handling, Multithreading, Collections Framework)',
    keyTopics: ['OOP Paradigms (Inheritance, Polymorphism, Abstraction, Encapsulation)', 'Java Packages, Interfaces, Exception Handling', 'Multithreading & Synchronization in Java', 'Java Generics, Collections Framework, Streams API', 'GUI Programming, Event Handling, JavaFX basics'],
  },
  {
    code: 'CS3601',
    name: 'Cryptography and Network Security',
    semester: 6,
    category: 'Computer Networks & Security',
    primaryTextbook: 'Cryptography and Network Security: Principles and Practice',
    authors: 'William Stallings',
    referenceBooks: [
      'Applied Cryptography (Bruce Schneier)',
      'Network Security Essentials: Applications and Standards (William Stallings)',
      'Understanding Cryptography (Christof Paar, Jan Pelzl)',
    ],
    rackLocation: 'Rack CSE-03 (Shelf B)',
    rackId: 'CSE-03',
    gateRelevance: 'Moderate (Symmetric ciphers DES/AES, Public-key RSA/Diffie-Hellman, SHA-256, Digital Signatures, Firewalls, Kerberos)',
    keyTopics: ['Classical Encryption Techniques, Block Ciphers, DES, AES', 'Public-Key Cryptography, Number Theory, RSA, Diffie-Hellman Key Exchange', 'Hash Functions, MAC, SHA-512, Digital Signatures', 'IPsec, SSL/TLS, HTTPS, Email Security (PGP)', 'Intrusion Detection Systems, Firewalls, Malicious Software Defense'],
  },
  {
    code: 'CS3701',
    name: 'Deep Learning',
    semester: 7,
    category: 'Artificial Intelligence & Machine Learning',
    primaryTextbook: 'Deep Learning (Adaptive Computation and Machine Learning series)',
    authors: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    referenceBooks: [
      'Neural Networks and Deep Learning (Michael Nielsen)',
      'Deep Learning with Python (François Chollet)',
    ],
    rackLocation: 'Rack CSE-04 (Shelf B)',
    rackId: 'CSE-04',
    gateRelevance: 'High in GATE DA (Data Science & AI stream)',
    keyTopics: ['Deep Feedforward Networks, Backpropagation, Activation Functions', 'Convolutional Neural Networks (CNNs) for Computer Vision', 'Recurrent Neural Networks (RNNs), LSTM, GRU', 'Transformers, Self-Attention, Large Language Models (LLMs)', 'Generative Adversarial Networks (GANs), Diffusion Models'],
  },
  {
    code: 'CS3491',
    name: 'Software Engineering',
    semester: 4,
    category: 'Software Engineering & Projects',
    primaryTextbook: 'Software Engineering: A Practitioner\'s Approach (9th Edition)',
    authors: 'Roger S. Pressman, Bruce R. Maxim',
    referenceBooks: [
      'Software Engineering (Ian Sommerville)',
      'Agile Estimating and Planning (Mike Cohn)',
      'Clean Code: A Handbook of Agile Software Craftsmanship (Robert C. Martin)',
    ],
    rackLocation: 'Rack CSE-08 (Shelf A)',
    rackId: 'CSE-08',
    gateRelevance: 'Moderate (Software Development Life Cycle SDLC, Agile Scrum, Testing Black-Box/White-Box, Design Patterns, Software Metrics)',
    keyTopics: ['SDLC Models (Waterfall, Spiral, Agile Scrum, Kanban)', 'Requirements Engineering, UML Diagrams (Use Case, Sequence, Class)', 'Software Architecture & Design Principles (SOLID, Clean Architecture)', 'Software Testing (Unit, Integration, System, Black/White Box, Cyclomatic Complexity)', 'DevOps, CI/CD, Software Maintenance & Refactoring'],
  },
];

export const KPRIET_LIBRARY_RULES = {
  institution: 'KPR Institute of Engineering and Technology (KPRIET), Coimbatore',
  department: 'Department of Computer Science and Engineering (CSE)',
  location: 'Block II (Newton Block), 2nd Floor, Room CS-204',
  hours: 'Monday to Saturday: 8:30 AM to 6:30 PM (Extended till 7:30 PM during exams and project submission weeks)',
  borrowingLimits: {
    ug: '3 Books for 14 Days',
    pg: '5 Books for 30 Days',
    faculty: '6 Books for Full Semester',
  },
  renewals: 'Up to 3 consecutive renewals allowed online or at the circulation desk before physical inspection is required.',
  fines: '₹2 per day per overdue book (waived on official college holidays/Sundays).',
  reservation: 'Place an online Hold/Reserve via this portal when copies reach 0; you receive priority notification upon return.',
  facilities: [
    'Direct Shelf Access to Racks CSE-01 to CSE-08',
    'Quiet Reading Cubicles & Faculty Research Lounge',
    'Department Reference Copies (Strictly for in-library reading)',
    'Digital Project Archive of B.E. & M.E. CSE Capstone Dissertations',
    'Barcode Scanners & Automated Circulation Issue Desk',
  ],
};

/**
 * Intelligent curriculum answer generator for queries regarding subjects, textbooks,
 * semester guides, GATE preparation, shelf locations, and library rules.
 */
export function generateCurriculumLibrarianResponse(query: string, currentBooks: Book[] = []): string {
  const q = query.toLowerCase();

  // 1. Library hours, rules, borrowing limits, fine policy
  if (
    q.includes('timing') ||
    q.includes('hour') ||
    q.includes('time') ||
    q.includes('rule') ||
    q.includes('limit') ||
    q.includes('fine') ||
    q.includes('renew') ||
    q.includes('borrow') ||
    q.includes('open')
  ) {
    return `### 🏛️ KPRIET CSE Department Library — Operating Hours & Policies

**📍 Location:** ${KPRIET_LIBRARY_RULES.location}
**⏰ Library Timings:** ${KPRIET_LIBRARY_RULES.hours}

#### 📋 Borrowing Limits & Loan Durations:
• **Undergraduate Students (B.E. CSE):** ${KPRIET_LIBRARY_RULES.borrowingLimits.ug}
• **Postgraduate Students (M.E. CSE / Ph.D.):** ${KPRIET_LIBRARY_RULES.borrowingLimits.pg}
• **Faculty & Research Scholars:** ${KPRIET_LIBRARY_RULES.borrowingLimits.faculty}

#### 🔄 Renewals & Fines:
• **Renewals:** ${KPRIET_LIBRARY_RULES.renewals}
• **Overdue Fine:** ${KPRIET_LIBRARY_RULES.fines}
• **Book Holds & Reservation:** ${KPRIET_LIBRARY_RULES.reservation}

*Tip:* You can check live availability of any book right now on the **Book Catalog** tab or reserve an issued title.`;
  }

  // 2. GATE CSE Preparation Query
  if (q.includes('gate') || q.includes('exam') || q.includes('placement') || q.includes('interview')) {
    return `### 🎯 Recommended Textbooks for GATE CSE & Technical Interviews

For **GATE Computer Science & Information Technology**, standard textbook author references are paramount. Here is the curated book guide available in our **KPRIET CSE Library**:

| Subject | Recommended Textbook | Author | Department Rack |
| :--- | :--- | :--- | :--- |
| **Data Structures & Algorithms** | *Introduction to Algorithms* | Cormen, Leiserson, Rivest, Stein (CLRS) | **Rack CSE-01** (Shelf A) |
| **Operating Systems** | *Operating System Concepts* | Silberschatz, Galvin, Gagne | **Rack CSE-02** (Shelf B) |
| **Database Systems (DBMS)** | *Database System Concepts* | Korth, Silberschatz, Sudarshan | **Rack CSE-02** (Shelf A) |
| **Computer Networks** | *Computer Networking: Top-Down* | Kurose & Ross / Tanenbaum | **Rack CSE-03** (Shelf A) |
| **Compiler Design** | *Compilers: Principles, Tech & Tools* | Aho, Lam, Sethi, Ullman (Dragon Book) | **Rack CSE-05** (Shelf A) |
| **Theory of Computation** | *Introduction to Automata Theory* | Hopcroft, Motwani, Ullman | **Rack CSE-05** (Shelf B) |
| **Discrete Mathematics** | *Discrete Mathematics & Applications* | Kenneth H. Rosen | **Rack CSE-07** (Shelf A) |
| **Computer Architecture** | *Computer Organization & Embedded* | Carl Hamacher / Morris Mano | **Rack CSE-01** (Shelf C) |

💡 **Pro-Tip for CSE Students:** Solve previous year GATE questions (PYQs) alongside reading the chapter end exercises in CLRS and Silberschatz!`;
  }

  // 3. Semester Specific Query (e.g. "Semester 3", "Semester 4", "Sem 5", etc.)
  const semMatch = q.match(/sem(?:ester)?\s*([1-8])/i);
  if (semMatch) {
    const semNumber = parseInt(semMatch[1], 10);
    const subjectsForSem = KPRIET_CSE_CURRICULUM.filter((s) => s.semester === semNumber);

    if (subjectsForSem.length > 0) {
      let resp = `### 📚 KPRIET CSE Curriculum — Semester ${semNumber} Textbooks & Shelf Locations\n\n`;
      resp += `Here are the official prescribed textbooks and reference titles for **Semester ${semNumber}**:\n\n`;

      subjectsForSem.forEach((subj) => {
        // Check matching live catalog book
        const catalogMatch = currentBooks.find(
          (b) => b.subjectCode.toLowerCase() === subj.code.toLowerCase() || b.title.toLowerCase().includes(subj.name.toLowerCase())
        );

        resp += `#### 📖 **${subj.code} — ${subj.name}**\n`;
        resp += `• **Standard Textbook:** *${subj.primaryTextbook}* by ${subj.authors}\n`;
        resp += `• **Department Location:** ${subj.rackLocation}\n`;
        if (catalogMatch) {
          const availText =
            catalogMatch.availableCopies > 0
              ? `✅ **AVAILABLE on shelf** (${catalogMatch.availableCopies}/${catalogMatch.totalCopies} copies ready)`
              : `⚠️ **Currently Checked Out** (0/${catalogMatch.totalCopies} on shelf - Click Reserve to place a hold)`;
          resp += `• **Live Shelf Status:** ${availText}\n`;
        }
        resp += `• **Key Topics:** ${subj.keyTopics.slice(0, 3).join(', ')}\n\n`;
      });

      return resp;
    }
  }

  // 4. Subject Specific Lookup (e.g., "OS", "Operating Systems", "DBMS", "Algorithms", "Networks", "AI", "Machine Learning", "Cormen", "Silberschatz", "Korth", "Rosen")
  const matchedSubject = KPRIET_CSE_CURRICULUM.find(
    (subj) =>
      q.includes(subj.code.toLowerCase()) ||
      q.includes(subj.name.toLowerCase()) ||
      q.includes(subj.category.toLowerCase()) ||
      subj.primaryTextbook.toLowerCase().split(' ').some((word) => word.length > 4 && q.includes(word)) ||
      subj.authors.toLowerCase().split(',').some((author) => {
        const lastName = author.trim().split(' ').pop()?.toLowerCase();
        return lastName && lastName.length > 3 && q.includes(lastName);
      })
  );

  if (matchedSubject) {
    const catalogBook = currentBooks.find(
      (b) =>
        b.subjectCode.toLowerCase() === matchedSubject.code.toLowerCase() ||
        b.title.toLowerCase().includes(matchedSubject.name.toLowerCase()) ||
        matchedSubject.primaryTextbook.toLowerCase().includes(b.title.toLowerCase())
    );

    let resp = `### 📘 Subject Guide: ${matchedSubject.code} — ${matchedSubject.name}\n\n`;
    resp += `• **Curriculum Term:** Semester ${matchedSubject.semester} (KPRIET Autonomous / Anna Univ Regulation)\n`;
    resp += `• **Prescribed Textbook:** *${matchedSubject.primaryTextbook}*\n`;
    resp += `• **Author(s):** ${matchedSubject.authors}\n`;
    resp += `• **Library Location:** **${matchedSubject.rackLocation}** (Block II CS-204)\n\n`;

    if (catalogBook) {
      resp += `#### 📦 Live Inventory Status:\n`;
      if (catalogBook.availableCopies > 0) {
        resp += `• **Status:** ✅ **AVAILABLE FOR ISSUE** (${catalogBook.availableCopies} of ${catalogBook.totalCopies} copies in Rack ${catalogBook.rackId})\n`;
        resp += `• **Accession Base:** \`${catalogBook.accessionNo}\` • ISBN: \`${catalogBook.isbn}\`\n\n`;
      } else {
        resp += `• **Status:** ⚠️ All ${catalogBook.totalCopies} copies are currently on loan. You can click the **Reserve** button on the book card to queue for the next available copy.\n\n`;
      }
    }

    resp += `#### 🔍 Core Syllabus Units Covered:\n`;
    matchedSubject.keyTopics.forEach((topic) => {
      resp += `• ${topic}\n`;
    });

    resp += `\n#### 📚 Additional Reference Readings:\n`;
    matchedSubject.referenceBooks.forEach((ref) => {
      resp += `• ${ref}\n`;
    });

    resp += `\n**GATE CSE Relevance:** ${matchedSubject.gateRelevance}`;
    return resp;
  }

  // 5. General / Catch-All Query Search in Live Catalog
  const relevantCatalogBooks = currentBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subjectCode.toLowerCase().includes(q) ||
      b.subjectName.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.tags.some((t) => q.includes(t.toLowerCase()))
  );

  if (relevantCatalogBooks.length > 0) {
    let resp = `### 📖 Found Matching Books in KPRIET CSE Department Library\n\n`;
    resp += `Here are the matching titles available in our department inventory for your query:\n\n`;

    relevantCatalogBooks.slice(0, 4).forEach((book) => {
      resp += `#### 📗 **${book.title}** (${book.subjectCode})\n`;
      resp += `• **Author:** ${book.author} | **Edition:** ${book.edition} (${book.year})\n`;
      resp += `• **Shelf Location:** ${book.rackLocation} (Rack ID: \`${book.rackId}\`)\n`;
      resp += `• **Availability:** ${
        book.availableCopies > 0
          ? `🟢 **${book.availableCopies}/${book.totalCopies} Available on Shelf**`
          : `🔴 **All ${book.totalCopies} copies issued out** (Reservation available)`
      }\n\n`;
    });

    resp += `You can view physical copy barcodes and detailed contents in the **Catalog** tab.`;
    return resp;
  }

  // 6. Comprehensive Overview / General Academic Greeting
  return `### 🎓 KPRIET CSE Department Library Advisor

I am trained on the **KPR Institute of Engineering and Technology (KPRIET)** Department of Computer Science & Engineering curriculum and physical library inventory in **Block II (Newton Block), Room CS-204**.

#### How I can assist you:
1. **Semester Textbook Recommendations**: Ask *"Which books for Semester 4?"* or *"Prescribed textbooks for DBMS & OS"*.
2. **Shelf & Rack Coordinates**: Ask *"Where is Cormen Algorithms?"* or *"Where is Tanenbaum Computer Networks?"*.
3. **Live Availability Check**: Check if a specific course book has copies on the shelf right now.
4. **GATE CSE Guidance**: Ask for high-weightage topics and standard reference authors.
5. **Library Timings & Borrowing Rules**: Ask about loan periods, UG/PG quota, fines, or renewals.

*Feel free to type your question above or choose one of the suggested prompts!*`;
}

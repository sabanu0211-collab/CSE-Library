# KPRIET CSE Department Library Management & AI Academic Advisor System

> **Department of Computer Science and Engineering**  
> **KPR Institute of Engineering and Technology (KPRIET)**  
> Autonomous Institution | NAAC A+ Accredited | Affiliated with Anna University  
> *Location: Block II (Newton Block), 2nd Floor, Room CS-204*

---

## 📖 Overview

A full-stack, enterprise-grade **Department Library Management & AI Academic Advisor System** built specifically for the Department of Computer Science and Engineering at KPRIET.

The application allows students to instantly check physical book availability on department shelves, explore curriculum textbooks for Anna University / KPRIET Autonomous regulations (Semesters 1 to 8), and interact with an AI Academic Librarian. It also provides a management console for librarians to issue books, process returns, calculate overdue fines, visualize physical shelf racks, and bulk-import books via Excel spreadsheets (`.xlsx`, `.xls`, `.csv`).

---

## ✨ Key Features

### 1. 🔍 Live Department Book Catalog & Shelf Availability
- **Real-Time Physical Stock**: Live tracking of available vs. checked-out copies across Racks `CSE-01` to `CSE-08`.
- **Curriculum Filtering**: Filter by semester (Semesters 1–8, Electives) or subject category (Data Structures, OS, DBMS, AI/ML, Networks, Cloud, Compilers, Mathematics).
- **Fast Search**: Instant search by Title, Author, Anna University Course Code (e.g. `CS3351`, `CS3451`, `CS3452`), ISBN, or Accession Number.
- **Book Hold & Reservation**: Students can place holds when copies reach 0.

### 2. 🤖 AI Librarian & Academic Syllabus Advisor
- **Curriculum-Grounded AI**: Trained on KPRIET Autonomous and Anna University CSE syllabi, prescribed author textbooks, and reference readings.
- **GATE CSE Recommendations**: Instant suggestions for high-weightage GATE topics (Algorithms, TOC, OS, DBMS, Networks, Discrete Maths).
- **Physical Rack Locator**: Tells students the exact room, rack, and shelf letter for any book.
- **Hybrid Guarantee**: Integrates Google Gemini (`@google/genai`) with an embedded offline curriculum knowledge base to ensure instant answers with zero downtime.

### 3. 📊 Excel Bulk Upload & Single Book Registration (Admin)
- **Direct Excel Spreadsheet Import**: Drag & drop `.xlsx`, `.xls`, or `.csv` files to import hundreds of catalog titles in seconds.
- **Batch Verification Table**: Review titles, author names, ISBNs, and copy counts before confirming addition.
- **Downloadable Sample Template**: 1-click download of `KPRIET_CSE_Book_Upload_Template.xlsx` formatted with curriculum columns.

### 4. 🔒 Role-Based Access Control (RBAC)
- **Student Portal**: Clean view with book browsing, availability status, holds, and the AI Syllabus Advisor.
- **Librarian / Admin Console**: Secured with role authentication (`admin123` / `cseadmin`) to unlock circulation desks, issue slips, Excel uploads, and audit histories.

### 5. 📋 Circulation Desk & Automated Fines
- **Book Issue Desk**: Issue copies by Accession Barcode to Student Roll Numbers with automatically computed 14-day due dates.
- **Printable Loan Slip**: Official receipt generator for student verification.
- **Returns & Renewal**: 1-click renewal (up to 3 times) and automated fine calculation (₹2/day overdue).
- **CSV Export**: Export all historical transactions and circulation records for audit compliance.

### 6. 🗺️ 2D Interactive Shelf & Rack Visualizer
- Visual 2D floor plan of Room CS-204 with color-coded shelf occupancy (Green = Available, Amber = 1 Left, Red = Full Loan).

---

## 🚀 How to Publish to Your GitHub Repository

To export and publish this project from **Google AI Studio** directly to your personal GitHub repository:

1. Click on the **Top Menu** (or the **Settings / Share** icon in the top right corner).
2. Select **"Export to GitHub"** (or **"Download ZIP"**).
3. Connect your GitHub account and choose your repository name (e.g., `kpriet-cse-library-management`).
4. Click **Export / Push** to commit all source code, components, services, and documentation to your GitHub repository!

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### Installation
```bash
# Clone your repository
git clone https://github.com/your-username/kpriet-cse-library-management.git
cd kpriet-cse-library-management

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env
```

### Environment Variables
Configure `.env` with your Gemini API key (optional, smart offline curriculum engine works out of the box):
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Run Locally
```bash
# Start development server (Port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ Department Library Rack Directory

| Rack ID | Subject Domain | Sample Prescribed Textbooks |
| :--- | :--- | :--- |
| **CSE-01** | Data Structures, Algorithms & Architecture | *Introduction to Algorithms* (Cormen - CLRS), *Computer Architecture* (Mano) |
| **CSE-02** | Operating Systems & DBMS | *Operating System Concepts* (Silberschatz), *Database System Concepts* (Korth) |
| **CSE-03** | Computer Networks & Security | *Computer Networking: Top-Down* (Kurose), *Cryptography & Network Security* (Stallings) |
| **CSE-04** | AI, Machine Learning & Data Science | *AI: A Modern Approach* (Russell & Norvig), *Deep Learning* (Goodfellow) |
| **CSE-05** | Theory of Computation & Compilers | *Introduction to Automata* (Hopcroft), *Compilers Dragon Book* (Aho & Ullman) |
| **CSE-06** | Cloud Computing, Distributed & IoT | *Cloud Computing* (Thomas Erl), *Internet of Things* (Bahga & Madisetti) |
| **CSE-07** | Discrete Mathematics & Statistics | *Discrete Mathematics and Its Applications* (Kenneth H. Rosen) |
| **CSE-08** | Software Engineering & Project Archives | *Software Engineering* (Roger S. Pressman), B.E. & M.E. Capstone Dissertations |

---

## 📄 License
Licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

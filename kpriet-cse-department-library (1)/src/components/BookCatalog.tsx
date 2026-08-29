import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MapPin,
  Plus,
  Bookmark,
  Eye,
  BookOpen,
  Layers,
  Sparkles,
  Check,
  Library,
  GraduationCap,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Book, BookCategory } from '../types';

interface BookCatalogProps {
  books: Book[];
  isAdmin?: boolean;
  onSelectBook: (book: Book) => void;
  onIssueBook: (book: Book) => void;
  onReserveBook: (book: Book) => void;
  onOpenAdminLogin?: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Subjects', value: 'ALL' },
  { label: 'Data Structures & Algorithms', value: 'Data Structures & Algorithms' },
  { label: 'Operating Systems', value: 'Operating Systems & System Software' },
  { label: 'DBMS', value: 'Database Management Systems' },
  { label: 'AI & Machine Learning', value: 'Artificial Intelligence & Machine Learning' },
  { label: 'Networks & Security', value: 'Computer Networks & Security' },
  { label: 'Cloud & Distributed', value: 'Cloud Computing & Distributed Systems' },
  { label: 'Theory & Compilers', value: 'Theory of Computation & Compiler Design' },
  { label: 'Computer Architecture', value: 'Computer Architecture & Microprocessors' },
  { label: 'Discrete Mathematics', value: 'Mathematics & Discrete Structures' },
];

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  isAdmin = false,
  onSelectBook,
  onIssueBook,
  onReserveBook,
  onOpenAdminLogin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'ISSUED' | 'LOW'>('ALL');
  const [semesterFilter, setSemesterFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Compute counts for quick filter tabs
  const availableCount = useMemo(() => books.filter((b) => b.availableCopies > 0).length, [books]);
  const totalAvailableCopies = useMemo(() => books.reduce((acc, b) => acc + b.availableCopies, 0), [books]);
  const checkedOutCount = useMemo(() => books.filter((b) => b.availableCopies === 0).length, [books]);

  // Filtered and searched books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search term matching
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.subjectCode.toLowerCase().includes(query) ||
        book.subjectName.toLowerCase().includes(query) ||
        book.accessionNo.toLowerCase().includes(query) ||
        book.isbn.toLowerCase().includes(query) ||
        book.rackLocation.toLowerCase().includes(query) ||
        book.tags.some((t) => t.toLowerCase().includes(query));

      // Category matching
      const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory;

      // Semester matching
      const matchesSemester =
        semesterFilter === 'ALL' ||
        (semesterFilter === 'Elective' && book.semester === 'Elective') ||
        String(book.semester) === semesterFilter;

      // Availability Filter
      let matchesAvailability = true;
      if (availabilityFilter === 'AVAILABLE') {
        matchesAvailability = book.availableCopies > 0;
      } else if (availabilityFilter === 'ISSUED') {
        matchesAvailability = book.availableCopies === 0;
      } else if (availabilityFilter === 'LOW') {
        matchesAvailability = book.availableCopies === 1;
      }

      return matchesSearch && matchesCategory && matchesSemester && matchesAvailability;
    });
  }, [books, searchTerm, selectedCategory, semesterFilter, availabilityFilter]);

  return (
    <div className="space-y-6">
      {/* Banner / Intro for Student vs Admin */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              CSE Department Book Catalog & Shelf Availability
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {isAdmin ? (
              <>
                <strong className="text-amber-400">Librarian Console:</strong> Live physical inventory across Racks CSE-01 to CSE-08. Issue copies or upload Excel batches anytime.
              </>
            ) : (
              <>
                <strong className="text-emerald-400">Student Portal:</strong> Check real-time on-shelf availability in Block II CS-204, view syllabus course codes, or reserve out-of-stock titles.
              </>
            )}
          </p>
        </div>

        {/* Quick stats pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>{totalAvailableCopies}</strong> Copies Ready on Shelf
            </span>
          </div>

          {!isAdmin && onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4 shadow-sm">
        {/* Top search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-catalog-search"
              type="text"
              placeholder="Search by book title, author, course code (e.g. CS3351), ISBN, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-2">
            <select
              id="select-semester-filter"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
              <option value="Elective">Elective Specializations</option>
            </select>

            {/* View switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Grid
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Live Availability Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Quick toggle chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-xs font-semibold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Availability:
            </span>

            <button
              id="filter-all-books"
              onClick={() => setAvailabilityFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                availabilityFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Catalog ({books.length})
            </button>

            <button
              id="filter-available-books"
              onClick={() => setAvailabilityFilter('AVAILABLE')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                availabilityFilter === 'AVAILABLE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/50 font-medium'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Available in CSE Dept ({availableCount})</span>
            </button>

            <button
              id="filter-low-books"
              onClick={() => setAvailabilityFilter('LOW')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                availabilityFilter === 'LOW'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950 text-amber-300 hover:bg-amber-950/40 border border-amber-800/50 font-medium'
              }`}
            >
              <span>1 Copy Left</span>
            </button>

            <button
              id="filter-issued-books"
              onClick={() => setAvailabilityFilter('ISSUED')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                availabilityFilter === 'ISSUED'
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'bg-slate-950 text-rose-400 hover:bg-rose-950/40 border border-rose-800/50 font-medium'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>All Checked Out ({checkedOutCount})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{filteredBooks.length}</strong> of {books.length} titles
          </div>
        </div>

        {/* Category Carousel / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-slate-100 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No matching books found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or reset the availability / category filter to browse other departments.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSemesterFilter('ALL');
              setAvailabilityFilter('ALL');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.availableCopies > 0;
            const isLowStock = book.availableCopies === 1;

            return (
              <div
                key={book.id}
                id={`book-card-${book.id}`}
                className={`bg-slate-900 rounded-2xl border ${
                  isAvailable ? 'border-slate-800 hover:border-emerald-500/50' : 'border-slate-800/80 hover:border-slate-700'
                } shadow-sm flex flex-col transition-all duration-200 hover:shadow-md hover:shadow-amber-500/5 overflow-hidden group`}
              >
                {/* Card Header Band */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Top Tag Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                        {book.subjectCode} • {book.semester === 'Elective' ? 'Elective' : `Sem ${book.semester}`}
                      </span>

                      {/* Availability status badge */}
                      {isAvailable ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isLowStock
                              ? 'bg-amber-950/60 text-amber-400 border-amber-700/60'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 shadow-xs'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>
                            {book.availableCopies} of {book.totalCopies} Available
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-700/60">
                          <XCircle className="w-3 h-3" />
                          <span>All Issued Out</span>
                        </span>
                      )}
                    </div>

                    {/* Book Title & Author */}
                    <h3
                      onClick={() => onSelectBook(book)}
                      className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-2"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      By <strong className="text-slate-300 font-normal">{book.author}</strong>
                    </p>
                  </div>

                  {/* Shelf Location & Availability Bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="line-clamp-1">{book.rackLocation}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Rack {book.rackId}</span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Shelf Stock</span>
                        <span className="font-mono">
                          {book.availableCopies}/{book.totalCopies} Copies
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isAvailable
                              ? isLowStock
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${(book.availableCopies / book.totalCopies) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
                  <button
                    id={`btn-view-book-${book.id}`}
                    onClick={() => onSelectBook(book)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isAdmin ? 'Details & Copies' : 'View Shelf Info'}</span>
                  </button>

                  {isAvailable ? (
                    isAdmin ? (
                      <button
                        id={`btn-issue-book-${book.id}`}
                        onClick={() => onIssueBook(book)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Issue</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectBook(book)}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold transition-all"
                        title="Available physically in Block II CS-204"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ready</span>
                      </button>
                    )
                  ) : (
                    <button
                      id={`btn-reserve-book-${book.id}`}
                      onClick={() => onReserveBook(book)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-semibold transition-all active:scale-95"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Reserve</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredBooks.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Accession / Code</th>
                  <th className="px-4 py-3 font-semibold">Book Title & Author</th>
                  <th className="px-4 py-3 font-semibold">Category / Subject</th>
                  <th className="px-4 py-3 font-semibold">Shelf Location</th>
                  <th className="px-4 py-3 font-semibold text-center">Availability</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr key={book.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-400">
                        <div className="font-semibold text-slate-200">{book.accessionNo}</div>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-amber-400 rounded">
                          {book.subjectCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          onClick={() => onSelectBook(book)}
                          className="font-bold text-slate-200 hover:text-amber-400 cursor-pointer line-clamp-1"
                        >
                          {book.title}
                        </div>
                        <div className="text-[11px] text-slate-400">By {book.author}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-300 line-clamp-1">{book.category}</div>
                        <div className="text-[10px] text-slate-400">
                          {book.semester === 'Elective' ? 'Elective' : `Sem ${book.semester}`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-amber-300 font-medium text-[11px]">{book.rackLocation}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/70">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>
                              {book.availableCopies}/{book.totalCopies} On Shelf
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-700/60">
                            Issued Out
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectBook(book)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                          >
                            Details
                          </button>
                          {isAvailable ? (
                            isAdmin ? (
                              <button
                                onClick={() => onIssueBook(book)}
                                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                              >
                                Issue
                              </button>
                            ) : null
                          ) : (
                            <button
                              onClick={() => onReserveBook(book)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-semibold"
                            >
                              Reserve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

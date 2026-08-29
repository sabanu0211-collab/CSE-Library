import React from 'react';
import {
  X,
  BookOpen,
  MapPin,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  Plus,
  Bookmark,
  Barcode,
  Layers,
  Tag,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';
import { Book, BookCopy } from '../types';

interface BookDetailModalProps {
  book: Book;
  isAdmin?: boolean;
  onClose: () => void;
  onIssueCopy: (book: Book, copyId?: string) => void;
  onReserveBook: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isAdmin = false,
  onClose,
  onIssueCopy,
  onReserveBook,
}) => {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">{book.title}</h3>
              <p className="text-xs text-slate-400">
                Accession Base: <span className="font-mono text-amber-400">{book.accessionNo}</span> • {book.subjectCode}
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

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          {/* Top Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left metadata */}
            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Author(s)</span>
                <p className="text-sm font-semibold text-slate-100 mt-0.5">{book.author}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-400">Subject / Code:</span>
                  <div className="font-semibold text-amber-300 mt-0.5">
                    {book.subjectCode} - {book.subjectName}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Curriculum Term:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {book.semester === 'Elective' ? 'Elective Specialization' : `Semester ${book.semester}`}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Publisher & Edition:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {book.publisher} • {book.edition} ({book.year})
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Standard ISBN:</span>
                  <div className="font-mono text-slate-200 mt-0.5">{book.isbn}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-400">Department Synopsis & Topics:</span>
                <p className="text-slate-300 leading-relaxed mt-1">{book.description}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 text-[10px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Shelf Coordinates Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Department Location
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center space-y-1">
                  <div className="font-bold text-amber-300 text-sm">{book.rackLocation}</div>
                  <div className="text-[11px] text-slate-400">Block II (Newton Block, 2nd Floor, Room CS-204)</div>
                </div>

                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Available Copies:</span>
                    <strong className="text-emerald-400 font-mono text-sm">
                      {book.availableCopies} / {book.totalCopies}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Subject Rack:</span>
                    <span className="font-mono text-slate-300">{book.rackId}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-800/80">
                {isAvailable ? (
                  isAdmin ? (
                    <button
                      onClick={() => onIssueCopy(book)}
                      className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Issue Copy to Student</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-center text-emerald-300 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="font-semibold">Ready on Department Shelf</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Visit Block II CS-204 to issue with your Student ID Card
                      </p>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => onReserveBook(book)}
                    className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Place Hold / Reserve Book</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Copy-by-Copy Inventory Table */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Physical Shelf Copy Breakdown ({book.copies.length} Accessioned Copies)</span>
            </h4>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-3.5 py-2.5 font-semibold">Copy Barcode / Accession</th>
                    <th className="px-3.5 py-2.5 font-semibold">Condition</th>
                    <th className="px-3.5 py-2.5 font-semibold">Shelf Status</th>
                    <th className="px-3.5 py-2.5 font-semibold">{isAdmin ? 'Issued To' : 'Status Info'}</th>
                    {isAdmin && <th className="px-3.5 py-2.5 font-semibold text-right">Desk Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {book.copies.map((copy) => (
                    <tr key={copy.copyId} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-3.5 py-2.5 font-mono text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Barcode className="w-3.5 h-3.5 text-slate-500" />
                          <span>{copy.accessionNumber}</span>
                        </div>
                      </td>

                      <td className="px-3.5 py-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                          {copy.condition}
                        </span>
                      </td>

                      <td className="px-3.5 py-2.5">
                        {copy.isAvailable ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Available on Shelf
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Checked Out
                          </span>
                        )}
                      </td>

                      <td className="px-3.5 py-2.5">
                        {copy.issuedTo ? (
                          isAdmin ? (
                            <div>
                              <div className="font-semibold text-slate-200">{copy.issuedTo.name}</div>
                              <div className="text-[10px] text-amber-400 font-mono">
                                Roll: {copy.issuedTo.rollNo} • Due: {copy.issuedTo.dueDate}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">On loan until {copy.issuedTo.dueDate}</span>
                          )
                        ) : (
                          <span className="text-emerald-400/80 text-[11px]">In Department Library (Ready)</span>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-3.5 py-2.5 text-right">
                          {copy.isAvailable ? (
                            <button
                              onClick={() => onIssueCopy(book, copy.copyId)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[11px] font-bold transition-all shadow-sm active:scale-95"
                            >
                              Issue Copy
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">On Loan</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            KPR Institute of Engineering and Technology • Department of CSE Library
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

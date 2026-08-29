import React, { useState } from 'react';
import { MapPin, BookOpen, Layers, CheckCircle2, XCircle, ArrowRight, Eye, Plus } from 'lucide-react';
import { Book } from '../types';
import { RACK_LAYOUT } from '../data/mockData';

interface RackVisualizerProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onIssueBook: (book: Book) => void;
}

export const RackVisualizer: React.FC<RackVisualizerProps> = ({
  books,
  onSelectBook,
  onIssueBook,
}) => {
  const [selectedRackId, setSelectedRackId] = useState<string>('CSE-01');

  const selectedRack = RACK_LAYOUT.find((r) => r.id === selectedRackId) || RACK_LAYOUT[0];
  const booksInRack = books.filter((b) => b.rackId === selectedRackId || b.rackLocation.includes(selectedRackId));

  const totalRackCopies = booksInRack.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableRackCopies = booksInRack.reduce((sum, b) => sum + b.availableCopies, 0);

  return (
    <div className="space-y-6">
      {/* Visualizer Header */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              CSE Department Library Shelf & Rack Floor Map
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 2D locator for Racks CSE-01 to CSE-08 (Block II - 2nd Floor Departmental Resource Center).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> All Checked Out
            </span>
          </div>
        </div>
      </div>

      {/* 2D Interactive Floor Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2D Rack Grid */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Library Bay Schematic (Click any rack to inspect contents)
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Entrance ➔ Block II</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RACK_LAYOUT.map((rack) => {
              const countInRack = books.filter((b) => b.rackId === rack.id || b.rackLocation.includes(rack.id)).length;
              const isSelected = selectedRackId === rack.id;

              return (
                <div
                  key={rack.id}
                  onClick={() => setSelectedRackId(rack.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between h-36 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.02]'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-400">{rack.id}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                      {countInRack} Titles
                    </span>
                  </div>

                  <div className="my-1">
                    <div className="font-bold text-xs text-slate-200 line-clamp-2">{rack.category}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{rack.section}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{rack.shelfCount} Shelves</span>
                    <span className={`font-semibold ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                      {isSelected ? 'Active View' : 'Inspect'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floor Reference Key */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Floor Plan:</strong> East Wing (CSE-01, CSE-02) • Central Bay (CSE-03, CSE-04) • West Wing (CSE-05, CSE-06) • South Wing (CSE-07, CSE-08)
            </span>
            <span className="text-amber-400">Air-Conditioned CSE Reading Room</span>
          </div>
        </div>

        {/* Right Selected Rack Contents */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4 flex flex-col">
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                {selectedRack.id}
              </span>
              <span className="text-xs text-slate-400">{selectedRack.section}</span>
            </div>
            <h3 className="font-bold text-base text-slate-100 mt-1">{selectedRack.category}</h3>
            <div className="flex items-center justify-between text-xs text-slate-300 mt-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span>Shelf Stock:</span>
              <strong className="text-emerald-400">
                {availableRackCopies} Available / {totalRackCopies} Total Copies
              </strong>
            </div>
          </div>

          {/* Book list inside this rack */}
          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
            {booksInRack.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No books currently assigned to this rack.
              </div>
            ) : (
              booksInRack.map((book) => {
                const isAvail = book.availableCopies > 0;
                return (
                  <div
                    key={book.id}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-mono text-amber-400 font-semibold">{book.subjectCode}</span>
                      {isAvail ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {book.availableCopies} on shelf
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Out of stock
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-xs text-slate-100 line-clamp-1">{book.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">By {book.author}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                      <span className="text-slate-400">{book.rackLocation.split(',')[1] || 'Shelf A'}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectBook(book)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px]"
                        >
                          Details
                        </button>
                        {isAvail && (
                          <button
                            onClick={() => onIssueBook(book)}
                            className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                          >
                            Issue
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

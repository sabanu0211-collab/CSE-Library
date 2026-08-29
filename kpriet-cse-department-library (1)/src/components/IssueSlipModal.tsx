import React from 'react';
import { X, Printer, CheckCircle2, Bookmark, FileText } from 'lucide-react';
import { IssueRecord } from '../types';

interface IssueSlipModalProps {
  issue: IssueRecord;
  onClose: () => void;
}

export const IssueSlipModal: React.FC<IssueSlipModalProps> = ({ issue, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-8 print:m-0 print:w-full print:max-w-none print:shadow-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <span className="font-semibold text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            Book Issue Receipt / Circulation Slip
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-all flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Slip Paper */}
        <div className="p-6 space-y-4 text-xs font-sans">
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3 space-y-0.5">
            <div className="font-extrabold text-sm uppercase tracking-tight text-slate-950">
              KPR Institute of Engineering and Technology
            </div>
            <div className="text-[11px] font-semibold text-slate-700">
              Department of Computer Science & Engineering
            </div>
            <div className="text-[10px] text-slate-500">
              Departmental Resource Center & Library • Avinashi Road, Coimbatore - 641407
            </div>
            <div className="pt-1">
              <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-bold text-[10px] uppercase tracking-wider">
                Official Book Issue Slip
              </span>
            </div>
          </div>

          {/* Barcode Simulator Block */}
          <div className="text-center bg-slate-50 p-2.5 rounded border border-dashed border-slate-300 space-y-1">
            <div className="font-mono text-2xl tracking-[0.3em] font-bold text-slate-800">
              ||| | |||| || ||||| | ||
            </div>
            <div className="font-mono text-[11px] font-bold text-slate-700">
              TX ID: {issue.transactionId} • Copy: {issue.copyId}
            </div>
          </div>

          {/* Book Info */}
          <div className="space-y-1 bg-amber-50/60 p-3 rounded border border-amber-200/80">
            <div className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">Book Issued:</div>
            <div className="font-bold text-slate-900 text-sm">{issue.bookTitle}</div>
            <div className="text-[11px] text-slate-700">By {issue.bookAuthor}</div>
            <div className="text-[10px] font-mono text-slate-600 mt-1">
              Accession No: <strong>{issue.accessionNo}</strong>
            </div>
          </div>

          {/* Borrower Info Table */}
          <div className="space-y-1 border border-slate-200 rounded p-3 text-[11px]">
            <div className="grid grid-cols-3 gap-1 py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Borrower:</span>
              <span className="col-span-2 font-bold text-slate-900">{issue.borrowerName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Roll / ID:</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">{issue.borrowerRollNo}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="col-span-2 text-slate-800">{issue.borrowerDepartment} ({issue.borrowerYearSection})</span>
            </div>
            <div className="grid grid-cols-3 gap-1 py-0.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Issue Date:</span>
              <span className="col-span-2 font-mono text-slate-800">{issue.issueDate}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 py-0.5 bg-amber-100/60 px-1 rounded">
              <span className="text-amber-900 font-bold">Return Due Date:</span>
              <span className="col-span-2 font-mono font-extrabold text-amber-950">{issue.dueDate}</span>
            </div>
          </div>

          {/* Rules & Fines Note */}
          <div className="text-[9.5px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="font-bold text-slate-800 uppercase">Library Circulation Policy:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Please return or renew on or before the due date (<strong className="text-slate-900">{issue.dueDate}</strong>).</li>
              <li>Overdue fine of ₹2.00 per day will be charged automatically past due date.</li>
              <li>Books must be returned in good physical condition without scribbling or torn pages.</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-center text-[10px] text-slate-700">
            <div>
              <div className="border-t border-slate-400 pt-1 font-semibold mx-4">Borrower Signature</div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1 font-semibold mx-4">
                Staff In-Charge: {issue.issuedBy.split('(')[0]}
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Hidden on print) */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-right print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, Printer, Sparkles, RefreshCw, Calendar, Settings } from 'lucide-react';

export default function ReportsView() {
  const [reportType, setReportType] = useState('audit');
  const [format, setFormat] = useState('pdf');
  const [compiling, setCompiling] = useState(false);

  const pastReports = [
    { name: 'SupplyShield Sourcing Risk Audit - Q1 2026.pdf', size: '2.4 MB', date: '2026-03-31' },
    { name: 'Global Semiconductor Exposure Index Scorecard.pdf', size: '1.8 MB', date: '2026-05-15' },
    { name: 'ISO Statutory Audits Consolidated Registry.xlsx', size: '840 KB', date: '2026-06-01' },
  ];

  const handleCompile = (e: React.FormEvent) => {
    e.preventDefault();
    setCompiling(true);
    setTimeout(() => {
      setCompiling(false);
      alert(`Report compilation successful. Download of master file initialized.`);
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Sourcing Report Compilation Suite</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Generate audited, print-ready scorecards and exposures indices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compiler Form (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#1E293B] pb-2">Compile Master Report</h3>

          <form onSubmit={handleCompile} className="space-y-4.5" id="reports-compiler-form">
            
            {/* Report Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Target Analytical Report</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none cursor-pointer hover:border-slate-700 transition"
              >
                <option value="audit">Sourcing Exposure Audit Summary (Exposure & Concentrations)</option>
                <option value="scorecard">Supplier Scorecard Benchmarking (SLA & Quality PPM)</option>
                <option value="statutory">Statutory Audit Compliance Registry (ISO Statuses)</option>
              </select>
            </div>

            {/* Inline select tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Date bounds */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Date Range Boundary</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none cursor-pointer hover:border-slate-700 transition">
                    <option value="90">Past 90 Days Telemetry</option>
                    <option value="180">Past 180 Days Telemetry</option>
                    <option value="365">Full 2025 Calendar Audit</option>
                  </select>
                </div>
              </div>

              {/* Download format */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Master Export Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none cursor-pointer hover:border-slate-700 transition"
                >
                  <option value="pdf">Audited PDF Documents (.pdf)</option>
                  <option value="excel">Microsoft Excel Sheet (.xlsx)</option>
                  <option value="json">Corporate Database JSON (.json)</option>
                </select>
              </div>

            </div>

            {/* Compile Submit */}
            <button
              type="submit"
              disabled={compiling}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#2C7BE5] hover:bg-[#2C7BE5]/90 text-white text-xs font-bold cursor-pointer transition active:scale-95 disabled:opacity-40"
              id="compiler-submit-btn"
            >
              {compiling ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Compiling Databases...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Compile & Download
                </>
              )}
            </button>

          </form>
        </div>

        {/* Past Downloads Grid column */}
        <div className="space-y-6">
          
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#1E293B] pb-2">Past Downloads Backlog</h3>
            
            <div className="space-y-3.5" id="past-reports-list">
              {pastReports.map((report, idx) => (
                <div key={idx} className="bg-[#0B0D14] p-3 border border-[#1E293B] rounded-xl flex items-center justify-between group hover:border-slate-700 transition">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2C7BE5] transition shrink-0" />
                    <div className="space-y-0.5">
                      <span className="block text-xs font-semibold text-[#E2E8F0] group-hover:text-white transition truncate max-w-[10rem]">{report.name}</span>
                      <span className="block text-[10px] text-[#94A3B8] font-mono">{report.size} • Compiled {report.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Re-downloading archived report: ${report.name}`)}
                    className="w-7 h-7 rounded bg-[#161926] border border-[#1E293B] hover:border-slate-700 text-[#94A3B8] hover:text-[#2C7BE5] transition flex items-center justify-center cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

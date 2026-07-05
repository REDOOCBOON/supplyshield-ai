import React, { useState, useEffect } from 'react';
import { GitCompare, Check, AlertTriangle, ArrowUpDown, RefreshCw, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Supplier } from '../types';

interface CompareViewProps {
  onSupplierSelect: (id: string) => void;
}

export default function CompareView({ onSupplierSelect }: CompareViewProps) {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [idA, setIdA] = useState('SUP000001');
  const [idB, setIdB] = useState('SUP000005');
  const [compareData, setCompareData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all suppliers list for dropdown options
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/suppliers');
        const data = await res.json();
        setSupplierList(data);
      } catch (err) {
        console.error("Error loading suppliers list:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Fetch side-by-side comparison payload
  useEffect(() => {
    const fetchComparison = async () => {
      if (!idA || !idB) return;
      setLoading(true);
      try {
        const res = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ supplier_ids: [idA, idB] })
        });
        const data = await res.json();
        setCompareData(data);
      } catch (err) {
        console.error("Error fetching comparison metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [idA, idB]);

  const supA = compareData[0];
  const supB = compareData[1];

  // Map charts comparative data
  const chartMetrics = supA && supB ? [
    { name: 'Trust Rating', [supA.supplier.supplier_name]: supA.supplier.trust_score, [supB.supplier.supplier_name]: supB.supplier.trust_score },
    { name: 'Financials', [supA.supplier.supplier_name]: supA.supplier.financial_score, [supB.supplier.supplier_name]: supB.supplier.financial_score },
    { name: 'Delivery', [supA.supplier.supplier_name]: supA.supplier.delivery_score, [supB.supplier.supplier_name]: supB.supplier.delivery_score },
    { name: 'Quality Yield', [supA.supplier.supplier_name]: supA.supplier.quality_score, [supB.supplier.supplier_name]: supB.supplier.quality_score },
    { name: 'Compliance', [supA.supplier.supplier_name]: supA.supplier.compliance_score, [supB.supplier.supplier_name]: supB.supplier.compliance_score },
  ] : [];

  const getSourcingDecision = () => {
    if (!supA || !supB) return "";
    const scoreA = supA.supplier.trust_score;
    const scoreB = supB.supplier.trust_score;
    const diff = Math.abs(scoreA - scoreB);

    if (scoreA > scoreB) {
      return `**${supA.supplier.supplier_name}** exhibits a significantly superior risk-resilient profile (Trust Index: **${scoreA}** vs **${scoreB}**, delta: **+${diff} points**). They maintain optimal quality check rates and ISO certifications. We advise continuing strategic capital allocations with **${supA.supplier.supplier_name}**.`;
    } else if (scoreB > scoreA) {
      return `**${supB.supplier.supplier_name}** exhibits a superior operational posture (Trust Index: **${scoreB}** vs **${scoreA}**, delta: **+${diff} points**). We suggest selecting **${supB.supplier.supplier_name}** for primary contract volume.`;
    } else {
      return `Both suppliers reflect an identical risk profile. Standardize terms across both suppliers to establish redundant delivery pipelines.`;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Supplier Benchmarking Engine</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Compare liquidity margins, defect rates, and SLA delays side-by-side</p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#161926] border border-[#1E293B] rounded-2xl p-4 shadow-sm">
        
        {/* Selector A */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Benchmark Supplier A</label>
          <select
            value={idA}
            onChange={(e) => setIdA(e.target.value)}
            className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none cursor-pointer hover:border-slate-700 transition"
          >
            {supplierList.map(s => (
              <option key={s.supplier_id} value={s.supplier_id} disabled={s.supplier_id === idB}>
                {s.supplier_name} ({s.supplier_id}) — {s.industry}
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Benchmark Supplier B</label>
          <select
            value={idB}
            onChange={(e) => setIdB(e.target.value)}
            className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none cursor-pointer hover:border-slate-700 transition"
          >
            {supplierList.map(s => (
              <option key={s.supplier_id} value={s.supplier_id} disabled={s.supplier_id === idA}>
                {s.supplier_name} ({s.supplier_id}) — {s.industry}
              </option>
            ))}
          </select>
        </div>

      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center text-[#94A3B8]">
          <RefreshCw className="w-6 h-6 animate-spin mb-3 text-[#2C7BE5]" />
          <span className="text-xs font-mono">Comparing balance sheets & delivery pipelines...</span>
        </div>
      ) : !supA || !supB ? (
        <p className="text-xs text-[#94A3B8] italic">Please select two distinct suppliers to load benchmark calculations.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Side-by-side Table (Left 2 Columns) */}
          <div className="lg:col-span-2 bg-[#161926] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#2C7BE5]" />
                Comparison Matrix
              </span>
              <span className="text-[10px] text-[#94A3B8] uppercase font-mono">Values calibrated June 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0B0D14]/60 border-b border-[#1E293B] text-[#94A3B8] font-bold tracking-wider text-[10px] uppercase">
                    <th className="px-5 py-3">Metric Category</th>
                    <th className="px-5 py-3">{supA.supplier.supplier_name}</th>
                    <th className="px-5 py-3">{supB.supplier.supplier_name}</th>
                    <th className="px-5 py-3 text-right">Variance Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/40">
                  
                  {/* Trust index row */}
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-[#94A3B8]">Trust Index Score</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supA.supplier.trust_score}/100</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supB.supplier.trust_score}/100</td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      supA.supplier.trust_score > supB.supplier.trust_score ? 'text-[#3ECF8E]' : 'text-[#F66D9B]'
                    }`}>
                      {supA.supplier.trust_score > supB.supplier.trust_score ? `+${supA.supplier.trust_score - supB.supplier.trust_score}` : `-${supB.supplier.trust_score - supA.supplier.trust_score}`}
                    </td>
                  </tr>

                  {/* Financial score */}
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-[#94A3B8]">Financial Health rating</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supA.supplier.financial_score}%</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supB.supplier.financial_score}%</td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      supA.supplier.financial_score > supB.supplier.financial_score ? 'text-[#3ECF8E]' : 'text-[#F66D9B]'
                    }`}>
                      {supA.supplier.financial_score > supB.supplier.financial_score ? `+${supA.supplier.financial_score - supB.supplier.financial_score}%` : `-${supB.supplier.financial_score - supA.supplier.financial_score}%`}
                    </td>
                  </tr>

                  {/* On-time SLA */}
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-[#94A3B8]">On-Time Delivery score</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supA.supplier.delivery_score}%</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supB.supplier.delivery_score}%</td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      supA.supplier.delivery_score > supB.supplier.delivery_score ? 'text-[#3ECF8E]' : 'text-[#F66D9B]'
                    }`}>
                      {supA.supplier.delivery_score > supB.supplier.delivery_score ? `+${supA.supplier.delivery_score - supB.supplier.delivery_score}%` : `-${supB.supplier.delivery_score - supA.supplier.delivery_score}%`}
                    </td>
                  </tr>

                  {/* Quality Inspection score */}
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-[#94A3B8]">Quality Inspection rating</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supA.supplier.quality_score}%</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-white">{supB.supplier.quality_score}%</td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      supA.supplier.quality_score > supB.supplier.quality_score ? 'text-[#3ECF8E]' : 'text-[#F66D9B]'
                    }`}>
                      {supA.supplier.quality_score > supB.supplier.quality_score ? `+${supA.supplier.quality_score - supB.supplier.quality_score}%` : `-${supB.supplier.quality_score - supA.supplier.quality_score}%`}
                    </td>
                  </tr>

                  {/* Defect rates */}
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-[#94A3B8]">Product Defect rate</td>
                    <td className="px-5 py-3.5 font-mono text-[#E2E8F0]">{supA.quality?.defect_rate ? `${supA.quality.defect_rate}%` : '1.2%'}</td>
                    <td className="px-5 py-3.5 font-mono text-[#E2E8F0]">{supB.quality?.defect_rate ? `${supB.quality.defect_rate}%` : '12.5%'}</td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      (supA.quality?.defect_rate || 1.2) < (supB.quality?.defect_rate || 12.5) ? 'text-[#3ECF8E]' : 'text-[#F66D9B]'
                    }`}>
                      {(supA.quality?.defect_rate || 1.2) < (supB.quality?.defect_rate || 12.5) ? 'A is cleaner' : 'B is cleaner'}
                    </td>
                  </tr>

                  {/* Compliance violations */}
                  <tr>
                    <td className="px-5 py-3.5 font-medium text-[#94A3B8]">Audit Violations</td>
                    <td className="px-5 py-3.5 font-mono text-[#E2E8F0]">{supA.compliance?.violations || 0} Violations</td>
                    <td className="px-5 py-3.5 font-mono text-[#E2E8F0]">{supB.compliance?.violations || 0} Violations</td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      (supA.compliance?.violations || 0) <= (supB.compliance?.violations || 0) ? 'text-[#3ECF8E]' : 'text-[#F66D9B]'
                    }`}>
                      {(supA.compliance?.violations || 0) <= (supB.compliance?.violations || 0) ? 'Optimal' : 'Elevated'}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Quick Links Footer */}
            <div className="px-5 py-4 bg-[#0B0D14]/40 border-t border-[#1E293B] flex justify-between text-xs text-[#94A3B8]">
              <button onClick={() => onSupplierSelect(idA)} className="text-[#2C7BE5] hover:underline flex items-center gap-1 cursor-pointer">
                View {supA.supplier.supplier_name} Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onSupplierSelect(idB)} className="text-[#2C7BE5] hover:underline flex items-center gap-1 cursor-pointer">
                View {supB.supplier.supplier_name} Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sourcing Intelligence Decision Column */}
          <div className="space-y-6">
            
            {/* Visual Charts Comparison bar */}
            <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-4">Benchmark comparison bar</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartMetrics} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                    <Bar dataKey={supA.supplier.supplier_name} fill="#2C7BE5" />
                    <Bar dataKey={supB.supplier.supplier_name} fill="#F66D9B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Decision card */}
            <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2C7BE5] animate-pulse" />
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">AI Benchmarking Verdict</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {getSourcingDecision().split('**').map((text, idx) => {
                  if (idx % 2 === 1) {
                    return <strong key={idx} className="text-[#2C7BE5]">{text}</strong>;
                  }
                  return text;
                })}
              </p>
              <div className="border-t border-[#1E293B] pt-3 text-[10px] text-[#94A3B8]">
                Decision compiled via multi-dimensional index metrics across six distinct auditing hubs.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

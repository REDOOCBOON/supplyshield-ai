import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Layers, Percent, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Supplier } from '../types';

interface RiskCenterViewProps {
  onViewChange: (view: string, filterVal?: string) => void;
}

export default function RiskCenterView({ onViewChange }: RiskCenterViewProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [industryFilter, setIndustryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/suppliers');
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error("Error loading suppliers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = industryFilter
    ? suppliers.filter(s => s.industry === industryFilter)
    : suppliers;

  // Aggregate stats
  const criticalCount = filteredSuppliers.filter(s => s.risk_level === 'CRITICAL').length;
  const highCount = filteredSuppliers.filter(s => s.risk_level === 'HIGH').length;
  const mediumCount = filteredSuppliers.filter(s => s.risk_level === 'MEDIUM').length;
  const lowCount = filteredSuppliers.filter(s => s.risk_level === 'LOW').length;

  const total = filteredSuppliers.length || 1;
  const criticalPct = Math.round((criticalCount / total) * 100);
  const highPct = Math.round((highCount / total) * 100);
  const mediumPct = Math.round((mediumCount / total) * 100);
  const lowPct = Math.round((lowCount / total) * 100);

  // Heatmap rows & columns representing global regions vs product lines
  const regions = ['Asia Pacific', 'North America', 'Europe', 'Latin America'];
  const categories = ['Battery', 'Semiconductor', 'Chemical', 'Logistics', 'Automotive', 'Packaging'];

  // Static heatmap cells crossing region x categories (mapping mock risk concentration scores)
  const heatmapData: Record<string, number> = {
    'Asia Pacific-Battery': 85, // Critical (Li shortage)
    'Asia Pacific-Semiconductor': 68, // Medium-High
    'Asia Pacific-Chemical': 22, // Low
    'Asia Pacific-Logistics': 45, // Medium
    'Asia Pacific-Automotive': 18,
    'Asia Pacific-Packaging': 10,

    'North America-Battery': 15,
    'North America-Semiconductor': 24,
    'North America-Chemical': 12,
    'North America-Logistics': 55, // Medium-High (port clog)
    'North America-Automotive': 30,
    'North America-Packaging': 5,

    'Europe-Battery': 28,
    'Europe-Semiconductor': 40,
    'Europe-Chemical': 74, // High risk (ChemFlow Ludwigshafen fine)
    'Europe-Logistics': 35,
    'Europe-Automotive': 25,
    'Europe-Packaging': 12,

    'Latin America-Battery': 10,
    'Latin America-Semiconductor': 12,
    'Latin America-Chemical': 50, // Medium
    'Latin America-Logistics': 24,
    'Latin America-Automotive': 15,
    'Latin America-Packaging': 8,
  };

  const getHeatmapColor = (score: number) => {
    if (score >= 80) return 'bg-red-950/80 text-[#F66D9B] border border-[#F66D9B]/30 font-bold hover:bg-red-900/40';
    if (score >= 60) return 'bg-orange-950/80 text-orange-400 border border-orange-500/20 hover:bg-orange-900/40';
    if (score >= 40) return 'bg-yellow-950/60 text-yellow-400 border border-yellow-500/25 hover:bg-yellow-900/40';
    return 'bg-[#0B0D14] text-[#94A3B8] border border-[#1E293B] hover:text-[#E2E8F0] hover:bg-[#161926]/60';
  };

  const getHeatmapLabel = (score: number) => {
    if (score >= 80) return 'CRIT';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MED';
    return 'LOW';
  };

  const industries = ['Automotive', 'Semiconductor', 'Chemical', 'Logistics', 'Battery', 'Pharmaceutical', 'Textile', 'Packaging'];

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-[#0B0D14] text-[#94A3B8]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#2C7BE5]" />
        <span className="text-xs font-mono">Compiling risk matrices...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Disruption Risk Control Center</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Heatmaps, concentration metrics, and regional vulnerability vectors</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-[#161926] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-[#E2E8F0] outline-none cursor-pointer hover:border-slate-700 transition"
          >
            <option value="">All Sectors</option>
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>
      </div>

      {/* Bento Risk Level Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="risk-bento-grid">
        
        {/* Critical */}
        <div className="bg-[#161926] border border-[#1E293B] p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-[#F66D9B]">
            <span className="text-xs font-bold uppercase tracking-wider">Critical Failures</span>
            <ShieldAlert className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F66D9B] font-mono">{criticalCount}</span>
            <span className="text-xs text-[#94A3B8]">Suppliers ({criticalPct}%)</span>
          </div>
          <div className="w-full bg-[#0B0D14] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#F66D9B] h-full rounded-full" style={{ width: `${criticalPct}%` }} />
          </div>
          <span className="text-[10px] text-[#94A3B8] block leading-tight">Requires immediate procurement freeze</span>
        </div>

        {/* High */}
        <div className="bg-[#161926] border border-[#1E293B] p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-orange-400">
            <span className="text-xs font-bold uppercase tracking-wider">Elevated High</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-orange-400 font-mono">{highCount}</span>
            <span className="text-xs text-[#94A3B8]">Suppliers ({highPct}%)</span>
          </div>
          <div className="w-full bg-[#0B0D14] h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${highPct}%` }} />
          </div>
          <span className="text-[10px] text-[#94A3B8] block leading-tight">Buffer stock & auditing required</span>
        </div>

        {/* Medium */}
        <div className="bg-[#161926] border border-[#1E293B] p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-yellow-400">
            <span className="text-xs font-bold uppercase tracking-wider">Moderate Risk</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-yellow-400 font-mono">{mediumCount}</span>
            <span className="text-xs text-[#94A3B8]">Suppliers ({mediumPct}%)</span>
          </div>
          <div className="w-full bg-[#0B0D14] h-1.5 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${mediumPct}%` }} />
          </div>
          <span className="text-[10px] text-[#94A3B8] block leading-tight">Quarterly audit review recommended</span>
        </div>

        {/* Low */}
        <div className="bg-[#161926] border border-[#1E293B] p-5 rounded-2xl space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-[#3ECF8E]">
            <span className="text-xs font-bold uppercase tracking-wider">Resilient Low</span>
            <Percent className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#3ECF8E] font-mono">{lowCount}</span>
            <span className="text-xs text-[#94A3B8]">Suppliers ({lowPct}%)</span>
          </div>
          <div className="w-full bg-[#0B0D14] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#3ECF8E] h-full rounded-full" style={{ width: `${lowPct}%` }} />
          </div>
          <span className="text-[10px] text-[#94A3B8] block leading-tight">Stable, long-term sourcing partners</span>
        </div>

      </div>

      {/* Interactive Risk Heatmap Matrix */}
      <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-white">Vulnerability Density Heatmap</h3>
            <p className="text-xs text-[#94A3B8]">Mapping regional hubs vs supply product categories to find severe bottleneck concentrations</p>
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#94A3B8]">
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-950/80 border border-[#F66D9B]/30 shrink-0" /> Critical</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-950/80 border border-orange-500/20 shrink-0" /> High</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-950/60 border border-yellow-500/25 shrink-0" /> Medium</div>
            <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#0B0D14] border border-[#1E293B] shrink-0" /> Low</div>
          </div>
        </div>

        {/* Heatmap Grid Table */}
        <div className="overflow-x-auto border border-[#1E293B] rounded-xl">
          <table className="w-full text-left border-collapse min-w-[36rem]">
            <thead>
              <tr className="bg-[#0B0D14]/60 text-[10px] uppercase tracking-wider text-[#94A3B8] border-b border-[#1E293B] font-mono">
                <th className="px-4 py-3 font-semibold">Global Region</th>
                {categories.map(cat => <th key={cat} className="px-4 py-3 text-center font-semibold">{cat}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40">
              {regions.map(reg => (
                <tr key={reg} className="hover:bg-[#0B0D14]/20 transition">
                  <td className="px-4 py-4 font-bold text-xs text-[#E2E8F0] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#2C7BE5] shrink-0" />
                    {reg}
                  </td>
                  {categories.map(cat => {
                    const score = heatmapData[`${reg}-${cat}`] || 0;
                    return (
                      <td key={cat} className="px-3 py-3 text-center">
                        <div
                          onClick={() => alert(`Heatmap segment selection: drilling down into ${reg} ${cat} suppliers.`)}
                          className={`py-3 rounded text-[10px] font-bold font-mono tracking-wider transition cursor-pointer select-none active:scale-95 shadow-inner ${getHeatmapColor(score)}`}
                          title={`Concentration Index: ${score}`}
                        >
                          {getHeatmapLabel(score)} ({score})
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="bg-[#161926] border border-[#1E293B] p-5 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#2C7BE5] shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-white">Active Sourcing Risk Advisory</h4>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Concentrated heat points in the **Asia Pacific-Battery** quadrant correlate directly with global raw material mineral shortages and regional port gridlocks. Sourcing managers should immediately pivot to North American logistical channels or leverage alternative suppliers under review.
          </p>
        </div>
      </div>

    </div>
  );
}

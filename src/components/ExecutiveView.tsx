import React, { useState, useEffect } from 'react';
import { Award, BarChart3, TrendingUp, Sparkles, AlertTriangle, FileText, Download, Printer, ShieldAlert } from 'lucide-react';
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

export default function ExecutiveView() {
  const [printMode, setPrintMode] = useState(false);

  // Corporate spend distribution data
  const spendData = [
    { segment: 'Semiconductors', spent: 12.4, riskIndex: 68 },
    { segment: 'Logistics Nodes', spent: 8.2, riskIndex: 52 },
    { segment: 'Raw Battery Cells', spent: 15.6, riskIndex: 82 },
    { segment: 'Specialty Chemicals', spent: 6.8, riskIndex: 40 },
    { segment: 'Chassis & Automotive', spent: 9.4, riskIndex: 18 },
  ];

  const savingsOpp = [
    { opp: 'Lithium Battery consolidation', savings: '$140,000', difficulty: 'Medium', details: 'Consolidate multiple Tier-2 battery nodes under a master high-trust contract to mitigate port SLA penalties.' },
    { opp: 'Semiconductor spot contract conversion', savings: '$85,000', difficulty: 'Low', details: 'Convert outstanding spot contracts to fixed long-term agreements with German hubs.' },
    { opp: 'Chemical logistics route hedging', savings: '$60,000', difficulty: 'High', details: 'Establish backup overland shipping routes for Specialty Chemicals to bypass European rail gridlocks.' },
  ];

  const handlePrint = () => {
    alert("Compiling executive PDF. Download initialized.");
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Board-Level Executive Insights</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">High-level capital allocations, financial exposure index, and saving recommendations</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161926] border border-[#1E293B] hover:border-slate-700 text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer transition active:scale-95"
          id="executive-download-btn"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Board Pack
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Exposure matrix description & Saving Opportunities (Left 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main saving opportunities card */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2C7BE5] animate-pulse" />
              <h3 className="text-sm font-semibold text-white">Strategic Capital Optimization Opportunities</h3>
            </div>

            <div className="space-y-3.5" id="savings-opps-list">
              {savingsOpp.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.opp}</span>
                      <span className={`text-[9px] font-bold px-1.5 rounded uppercase ${
                        item.difficulty === 'Low' ? 'bg-[#3ECF8E]/15 text-[#3ECF8E]' : item.difficulty === 'Medium' ? 'bg-yellow-950/40 text-yellow-400' : 'bg-[#F66D9B]/15 text-[#F66D9B]'
                      }`}>
                        {item.difficulty} Effort
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{item.details}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs text-[#94A3B8] font-medium">Estimated Savings</span>
                    <span className="block text-base font-extrabold text-[#3ECF8E] font-mono">{item.savings}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic advisory briefing */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white">Operations Exposure Briefing</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Our models indicate that **Specialty Chemicals** represent a low-risk, high-efficiency sector, allowing for potential consolidation. However, **Raw Battery Cells** remain heavily vulnerable with an exposure risk index of **82/100**. Enterprise executives should immediately authorize the redundant sourcing initiatives suggested by our simulator model.
            </p>
          </div>

        </div>

        {/* Capital allocation charts column */}
        <div className="space-y-6">
          
          {/* Spend allocation charts */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Segment Sourcing Expenditures</h3>
              <p className="text-[11px] text-[#94A3B8]">Corporate capital allocations (in Millions $)</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData} layout="vertical" margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={10} />
                  <YAxis dataKey="segment" type="category" stroke="#94A3B8" fontSize={9} width={75} />
                  <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                  <Bar name="Procurement Capital ($M)" dataKey="spent" fill="#2C7BE5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk index overlay stats */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Board KPI Index</h3>
            
            <div className="space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                <span>Aggregate exposure risk</span>
                <span className="font-bold text-yellow-400">Moderate (52/100)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                <span>Contract SLA precision</span>
                <span className="font-bold text-[#3ECF8E]">94.2%</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#94A3B8]">
                <span>Total active capital risk</span>
                <span className="font-bold text-[#F66D9B]">$4.2M</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

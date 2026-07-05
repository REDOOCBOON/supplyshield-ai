import React from 'react';
import { BarChart3, TrendingUp, Sliders, RefreshCw, HelpCircle, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function AnalyticsView() {
  
  // High density analytics dataset
  const monthlySLAData = [
    { month: 'Jan', slaRate: 92, defectRate: 1.4, volume: 1500 },
    { month: 'Feb', slaRate: 94, defectRate: 1.1, volume: 1650 },
    { month: 'Mar', slaRate: 91, defectRate: 2.3, volume: 1400 },
    { month: 'Apr', slaRate: 95, defectRate: 0.9, volume: 1800 },
    { month: 'May', slaRate: 93, defectRate: 1.5, volume: 1950 },
    { month: 'Jun', slaRate: 96, defectRate: 1.0, volume: 2100 },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Multi-Dimensional Sourcing Analytics</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Correlation charts for SLA compliance rates, defect margins, and logistics capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SLA Rate over Volume Line Chart */}
        <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">SLA Adherence vs Logistics Volume</h3>
            <p className="text-[11px] text-[#94A3B8]">Correlation metrics mapping procurement contract scales to fulfillment speeds</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySLAData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line name="SLA Fulfillment Rate (%)" type="monotone" dataKey="slaRate" stroke="#3ECF8E" strokeWidth={2.5} />
                <Line name="Logistics Unit Volume (x10)" type="monotone" dataKey="volume" stroke="#2C7BE5" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect rate correlation bar chart */}
        <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white">PPM Defect Margin Density</h3>
            <p className="text-[11px] text-[#94A3B8]">Defect ratios calculated across raw manufacturing batch lots</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySLAData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar name="Yield Defect Rate (%)" dataKey="defectRate" fill="#F66D9B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Analytics advisory notes bar */}
      <div className="bg-[#161926] border border-[#1E293B] p-5 rounded-2xl flex gap-3">
        <Activity className="w-5 h-5 text-[#2C7BE5] shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <span className="block text-xs font-semibold text-white">Analytical Regression Notes</span>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Data models show high-volume transport channels are currently correlating with lower defect yields due to standardized containerized freight workflows. Specialty batch configurations (e.g. low-volume Chemical items) reflect volatile PPM fluctuations. Sourcing executives are advised to stabilize volumes.
          </p>
        </div>
      </div>

    </div>
  );
}

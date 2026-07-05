import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Shield,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DashboardSummary, Alert, Recommendation } from '../types';

interface DashboardViewProps {
  onViewChange: (view: string, targetId?: string) => void;
}

export default function DashboardView({ onViewChange }: DashboardViewProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [aiRecs, setAiRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, alertsRes, recsRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/alerts'),
        fetch('/api/recommendations')
      ]);

      const summaryData = await summaryRes.json();
      const alertsData = await alertsRes.json();
      const recsData = await recsRes.json();

      setSummary(summaryData);
      setRecentAlerts(alertsData.slice(0, 5));
      setAiRecs(recsData.slice(0, 3));
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Static chart data (cross-cutting monthly overview)
  const spendTrendData = [
    { month: 'Jan', spend: 320, trust: 80 },
    { month: 'Feb', spend: 340, trust: 81 },
    { month: 'Mar', spend: 310, trust: 79 },
    { month: 'Apr', spend: 350, trust: 82 },
    { month: 'May', spend: 370, trust: 84 },
    { month: 'Jun', spend: 380, trust: 83 }
  ];

  const getRiskCount = (level: string) => {
    if (!summary || !(summary as any).risk_distribution) {
      if (level === 'LOW') return 165;
      if (level === 'MEDIUM') return 25;
      if (level === 'HIGH') return 10;
      return 0;
    }
    const match = (summary as any).risk_distribution.find((d: any) => d.risk_level === level);
    return match ? match.count : 0;
  };

  // Risk distribution pie data derived dynamically
  const riskDistributionData = [
    { name: 'Low Risk', value: getRiskCount('LOW'), color: '#3ECF8E' },
    { name: 'Medium Risk', value: getRiskCount('MEDIUM'), color: '#F59E0B' },
    { name: 'High Risk', value: getRiskCount('HIGH'), color: '#F66D9B' },
    { name: 'Critical Risk', value: getRiskCount('CRITICAL'), color: '#991B1B' }
  ];

  if (loading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#0B0D14] text-[#94A3B8]">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#1E293B] border-t-[#2C7BE5] animate-spin" />
          <Activity className="w-4 h-4 text-[#2C7BE5] absolute" />
        </div>
        <p className="text-xs font-mono text-[#94A3B8]">Aggregating supply chain telemetry...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Upper Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Procurement Command Console</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Real-time supplier integrity indexation & risk forecasting</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161926] border border-[#1E293B] hover:border-blue-500/40 text-xs font-medium text-[#94A3B8] hover:text-white transition cursor-pointer disabled:opacity-50"
            id="dashboard-refresh-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        
        {/* KPI 1 */}
        <div
          onClick={() => onViewChange('suppliers')}
          className="bg-[#161926] hover:bg-[#1E293B]/40 border border-[#1E293B] hover:border-[#2C7BE5]/40 rounded-2xl p-5 cursor-pointer transition shadow-sm group"
          id="kpi-total-suppliers"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#94A3B8] mb-1">Total Suppliers</span>
            <div className="w-8 h-8 rounded-lg bg-[#2C7BE5]/10 text-[#2C7BE5] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.total_suppliers || 5000}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[#3ECF8E] text-[10px] font-bold">
            <span>+12 this month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onViewChange('risk')}
          className="bg-[#161926] hover:bg-[#1E293B]/40 border border-[#1E293B] border-l-4 border-l-[#F66D9B] hover:border-[#F66D9B]/40 rounded-2xl p-5 cursor-pointer transition shadow-sm group"
          id="kpi-high-risk"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#94A3B8] mb-1">High Risk Suppliers</span>
            <div className="w-8 h-8 rounded-lg bg-[#F66D9B]/10 text-[#F66D9B] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.high_risk || 142}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[#F66D9B] text-[10px] font-bold">
            <span>-4.2% Criticality</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onViewChange('alerts')}
          className="bg-[#161926] hover:bg-[#1E293B]/40 border border-[#1E293B] hover:border-[#F66D9B]/40 rounded-2xl p-5 cursor-pointer transition shadow-sm group"
          id="kpi-critical"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#94A3B8] mb-1">Critical Failures</span>
            <div className="w-8 h-8 rounded-lg bg-red-950/20 text-[#F66D9B] border border-[#F66D9B]/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#F66D9B]">{summary?.critical || 18}</span>
          </div>
          <div className="mt-2 text-[10px] text-[#94A3B8] font-mono">Disruption vectors alert</div>
        </div>

        {/* KPI 4 */}
        <div
          className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm"
          id="kpi-avg-trust"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#94A3B8] mb-1">Avg. Trust Score</span>
            <div className="w-8 h-8 rounded-lg bg-[#2C7BE5]/10 text-[#2C7BE5] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{summary?.average_trust_score || 83} <span className="text-sm font-normal text-[#94A3B8]">/ 100</span></span>
          </div>
          <div className="w-full h-1 bg-[#1E293B] rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-[#2C7BE5]" style={{ width: `${summary?.average_trust_score || 83}%` }}></div>
          </div>
        </div>

      </div>

      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Charts (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Trend Chart Card */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-[#2C7BE5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                Trust Score & Risk Trends
              </h2>
              <div className="flex gap-2">
                <span className="text-[10px] bg-[#1E293B] px-2.5 py-1 rounded text-[#94A3B8] cursor-pointer hover:text-white transition">6 Months</span>
                <span className="text-[10px] bg-[#2C7BE5]/20 px-2.5 py-1 rounded text-white font-medium cursor-pointer border border-[#2C7BE5]/20">12 Months</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendTrendData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B', borderRadius: '8px' }}
                    labelStyle={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#E2E8F0', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="top" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  <Line name="Monthly spend (in Millions $)" type="monotone" dataKey="spend" stroke="#2C7BE5" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line name="Avg Trust Index (/100)" type="monotone" dataKey="trust" stroke="#3ECF8E" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI recommendations widget */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#3ECF8E] animate-pulse" />
              <h2 className="text-sm font-bold text-white">AI Recommendations</h2>
            </div>
            <div className="space-y-3" id="recs-list">
              {aiRecs.map((rec) => (
                <div
                  key={rec.supplier_id}
                  onClick={() => onViewChange('supplier_details', rec.supplier_id)}
                  className="bg-[#0B0D14] hover:bg-[#1E293B]/40 border border-[#1E293B] hover:border-[#2C7BE5]/40 rounded-xl p-3.5 cursor-pointer transition flex items-start justify-between group"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#E2E8F0] group-hover:text-white transition">{rec.supplier_name}</span>
                      <span className="text-[9px] font-mono text-[#94A3B8] uppercase">{rec.industry}</span>
                    </div>
                    <p className="text-xs text-[#94A3B8] line-clamp-1">{rec.recommendation}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono border ${
                      rec.priority === 'Critical'
                        ? 'bg-[#F66D9B]/10 text-[#F66D9B] border-[#F66D9B]/20'
                        : rec.priority === 'High'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : 'bg-[#1E293B]/50 text-[#94A3B8] border-[#1E293B]'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-white transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right side charts & Recent Alerts log */}
        <div className="space-y-6">
          
          {/* Pie Chart Card */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Level Demographics</h3>
            <div className="h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '11px', color: '#E2E8F0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-white">{summary ? summary.total_suppliers : "200"}</span>
                <span className="text-[9px] text-[#94A3B8] uppercase tracking-widest">Sellers</span>
              </div>
            </div>
            
            {/* Custom Legends */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#1E293B]">
              {riskDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts Feed */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Alerts Telemetry</h3>
              <button
                onClick={() => onViewChange('alerts')}
                className="text-xs text-[#2C7BE5] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                Log
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3" id="recent-alerts-list">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.alert_id}
                  className="p-3 bg-[#0B0D14] border border-[#1E293B] rounded-lg flex gap-3 hover:border-blue-500/30 transition"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-[#F66D9B] animate-pulse'
                      : alert.severity === 'HIGH'
                      ? 'bg-orange-500'
                      : 'bg-yellow-500'
                  }`} />
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-[#E2E8F0]">{alert.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-1">{alert.message}</p>
                    <span className="text-[9px] text-[#94A3B8] font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-[#94A3B8]" />
                      {new Date(alert.time).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

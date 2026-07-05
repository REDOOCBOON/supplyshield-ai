import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Users,
  Award,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Activity,
  UserCheck,
  Percent,
  Download,
  Flame,
  HelpCircle,
  ThumbsUp,
  Briefcase
} from 'lucide-react';
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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Supplier,
  FinancialHistory,
  DeliveryHistory,
  Order,
  QualityRecord,
  ComplianceRecord,
  Complaint,
  AIPrediction,
  ExplainableAI,
  Recommendation,
  RiskTimelineItem
} from '../types';

interface SupplierDetailViewProps {
  supplierId: string;
  onBack: () => void;
  onViewChange: (view: string) => void;
}

export default function SupplierDetailView({ supplierId, onBack, onViewChange }: SupplierDetailViewProps) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [financials, setFinancials] = useState<FinancialHistory[]>([]);
  const [delivery, setDelivery] = useState<DeliveryHistory[]>([]);
  
  // Quality endpoint payload
  const [quality, setQuality] = useState<QualityRecord | null>(null);
  const [compliance, setCompliance] = useState<ComplianceRecord | null>(null);
  const [complaintsList, setComplaintsList] = useState<Complaint[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const [timeline, setTimeline] = useState<RiskTimelineItem[]>([]);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [explainable, setExplainable] = useState<ExplainableAI | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'financial' | 'delivery' | 'quality' | 'compliance' | 'timeline' | 'predictions' | 'recs' | 'documents'>('financial');

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const [
          supRes,
          finRes,
          delRes,
          qualRes,
          timeRes,
          predRes
        ] = await Promise.all([
          fetch(`/api/supplier/${supplierId}`),
          fetch(`/api/supplier/${supplierId}/financial`),
          fetch(`/api/supplier/${supplierId}/delivery`),
          fetch(`/api/supplier/${supplierId}/quality`),
          fetch(`/api/supplier/${supplierId}/timeline`),
          fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplier_id: supplierId })
          })
        ]);

        if (supRes.ok) setSupplier(await supRes.json());
        if (finRes.ok) setFinancials(await finRes.json());
        if (delRes.ok) setDelivery(await delRes.json());
        
        if (qualRes.ok) {
          const qualPayload = await qualRes.json();
          setQuality(qualPayload.quality);
          setCompliance(qualPayload.compliance);
          setComplaintsList(qualPayload.complaints);
          setOrdersList(qualPayload.orders);
        }

        if (timeRes.ok) setTimeline(await timeRes.json());
        
        if (predRes.ok) {
          const predPayload = await predRes.json();
          setPrediction(predPayload.prediction);
          setExplainable(predPayload.explainable);
          setRecommendation(predPayload.recommendation);
        }
      } catch (err) {
        console.error("Error aggregating supplier records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#0B0D14] text-[#94A3B8]">
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#1E293B] border-t-[#2C7BE5] animate-spin" />
          <Activity className="w-4 h-4 text-[#2C7BE5] absolute" />
        </div>
        <p className="text-xs font-mono">Reconstructing supplier digital twin...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex-1 p-8 text-center text-[#94A3B8] bg-[#0B0D14]">
        <p>Supplier record not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#161926] rounded-lg border border-[#1E293B] text-white">Return to Directory</button>
      </div>
    );
  }

  // Calculate delivery pie chart data
  const onTimeCount = ordersList.filter(o => o.status === 'Delivered').length;
  const delayedCount = ordersList.filter(o => o.status === 'Delayed').length;
  const transitCount = ordersList.filter(o => o.status === 'In Transit').length;

  const orderDistribution = [
    { name: 'Delivered On-Time', value: onTimeCount || 5, color: '#3ECF8E' },
    { name: 'Delayed SLA', value: delayedCount || 1, color: '#F66D9B' },
    { name: 'In Transit', value: transitCount || 2, color: '#2C7BE5' }
  ].filter(o => o.value > 0);

  const getRiskColorClass = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-[#F66D9B] bg-[#F66D9B]/15 border-[#F66D9B]/10';
      case 'HIGH': return 'text-orange-500 bg-orange-950/40 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/20';
      default: return 'text-[#3ECF8E] bg-[#3ECF8E]/15 border-[#3ECF8E]/10';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Detail Header / Back Shortcut */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-lg bg-[#161926] border border-[#1E293B] hover:border-slate-700 flex items-center justify-center text-[#94A3B8] hover:text-white transition cursor-pointer"
          title="Back to supplier directory"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] text-[#94A3B8] font-mono font-bold uppercase tracking-wider">Audit Profile View</span>
          <h2 className="text-lg font-bold text-white leading-tight">{supplier.supplier_name}</h2>
        </div>
      </div>

      {/* Top Section: Overview & Core Trust Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Box 1: Firmographics */}
        <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#1E293B] pb-2">Firmographics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] font-medium">Identifier</span>
              <span className="block text-xs font-mono font-semibold text-[#E2E8F0]">{supplier.supplier_id}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] font-medium">Industry Sector</span>
              <span className="block text-xs font-semibold text-[#E2E8F0]">{supplier.industry}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] font-medium">Operational Hub</span>
              <span className="block text-xs font-semibold text-[#E2E8F0]">{supplier.city}, {supplier.country}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] font-medium">Network tier</span>
              <span className="block text-xs font-semibold text-[#2C7BE5] font-mono">{supplier.tier}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] font-medium">Years Active</span>
              <span className="block text-xs font-semibold text-[#E2E8F0]">{supplier.years_in_business} Years</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] font-medium">Global headcount</span>
              <span className="block text-xs font-semibold text-[#E2E8F0]">{supplier.employees} Employees</span>
            </div>
          </div>

          <div className="border-t border-[#1E293B] pt-3 flex justify-between items-center text-xs">
            <span className="text-[#94A3B8]">Telemetry Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${
              supplier.status === 'ACTIVE'
                ? 'text-[#3ECF8E] bg-[#3ECF8E]/15 border-[#3ECF8E]/10'
                : 'text-yellow-400 bg-yellow-950/40 border-yellow-500/10'
            }`}>
              {supplier.status === 'ACTIVE' ? 'Active Sourcing' : 'Under Review'}
            </span>
          </div>
        </div>

        {/* Box 2: Circular Trust Score Gauge */}
        <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm flex flex-col items-center justify-between">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider self-start border-b border-[#1E293B] pb-2 w-full">Trust Index Rating</h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Outer track */}
              <circle cx="50" cy="50" r="42" stroke="#111420" strokeWidth="8" fill="transparent" />
              {/* Progress track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={supplier.trust_score >= 80 ? '#3ECF8E' : supplier.trust_score >= 65 ? '#F59E0B' : '#F66D9B'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="263.8"
                strokeDashoffset={263.8 - (263.8 * supplier.trust_score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold font-mono tracking-tight text-white">{supplier.trust_score}</span>
              <span className="text-[9px] text-[#94A3B8] uppercase font-bold tracking-widest mt-0.5">Score</span>
            </div>
          </div>

          <span className={`px-3 py-1 font-bold text-xs rounded-lg border uppercase font-mono tracking-wide ${getRiskColorClass(supplier.risk_level)}`}>
            {supplier.risk_level} Risk Level
          </span>
        </div>

        {/* Box 3: Explainable AI & Recommendations summary */}
        <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#1E293B] pb-2 mb-3">AI Explanatory Anchors</h3>
            <ul className="space-y-2">
              {explainable?.top_factors.map((factor, idx) => (
                <li key={idx} className="flex gap-2 text-xs text-[#E2E8F0]">
                  <CheckCircle className="w-4 h-4 text-[#2C7BE5] shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </li>
              )) || (
                <li className="text-xs text-[#94A3B8] italic">No explainable metrics compiled.</li>
              )}
            </ul>
          </div>

          <div className="border-t border-[#1E293B] pt-3 mt-4">
            <span className="block text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider mb-1">Recommended Posture</span>
            <p className="text-xs font-medium text-[#2C7BE5] line-clamp-2">
              {recommendation?.recommendation || "Continue standard sourcing contracts."}
            </p>
          </div>
        </div>

      </div>

      {/* Sub-scores Overview Metrics bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Financial Index', val: supplier.financial_score, desc: 'Balance sheet leverage' },
          { label: 'Delivery Precision', val: supplier.delivery_score, desc: 'On-time SLA adherence' },
          { label: 'Quality Index', val: supplier.quality_score, desc: 'Yield & inspection checks' },
          { label: 'Regulatory Audits', val: supplier.compliance_score, desc: 'ISO & statutory clean record' }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#161926] border border-[#1E293B] rounded-2xl p-4 flex justify-between items-center">
            <div className="space-y-1">
              <span className="block text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">{item.label}</span>
              <span className="block text-lg font-bold font-mono text-white">{item.val}%</span>
              <span className="block text-[9px] text-[#94A3B8] font-mono leading-none">{item.desc}</span>
            </div>
            <div className="w-1.5 h-10 rounded bg-[#111420] overflow-hidden shrink-0">
              <div
                className={`h-full rounded ${
                  item.val >= 85 ? 'bg-[#3ECF8E]' : item.val >= 70 ? 'bg-yellow-500' : 'bg-[#F66D9B]'
                }`}
                style={{ height: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Inner Tabs Navigation Bar */}
      <div className="border-b border-[#1E293B] flex items-center overflow-x-auto scrollbar-none select-none">
        {[
          { id: 'financial', label: 'Financials' },
          { id: 'delivery', label: 'Delivery logs' },
          { id: 'quality', label: 'Quality controls' },
          { id: 'compliance', label: 'Regulatory Compliance' },
          { id: 'timeline', label: 'Risk History' },
          { id: 'predictions', label: 'Disruption Forecast' },
          { id: 'recs', label: 'AI Mitigation' },
          { id: 'documents', label: 'Contracts Backlog' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-3.5 border-b-2 text-xs font-semibold tracking-wide whitespace-nowrap cursor-pointer transition ${
              activeTab === t.id
                ? 'border-[#2C7BE5] text-[#2C7BE5] font-bold'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tabs Content Render Block */}
      <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 shadow-sm min-h-[16rem]">
        
        {/* Tab 1: Financial Health */}
        {activeTab === 'financial' && (
          <div className="space-y-6" id="detail-tab-financial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Financial KPIs */}
              <div className="md:col-span-1 space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Balance Sheet Indices</h4>
                
                {financials.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-[#0B0D14] p-3.5 border border-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-xs text-[#94A3B8]">Operating Cash Flow</span>
                      <span className="text-xs font-mono font-bold text-white">${financials[0].cash_flow.toLocaleString()}</span>
                    </div>
                    <div className="bg-[#0B0D14] p-3.5 border border-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-xs text-[#94A3B8]">Profit Margin Ratio</span>
                      <span className="text-xs font-mono font-bold text-white">{financials[0].profit_margin}%</span>
                    </div>
                    <div className="bg-[#0B0D14] p-3.5 border border-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-xs text-[#94A3B8]">Current ratio</span>
                      <span className="text-xs font-mono font-bold text-white">{financials[0].current_ratio}</span>
                    </div>
                    <div className="bg-[#0B0D14] p-3.5 border border-[#1E293B] rounded-xl flex justify-between">
                      <span className="text-xs text-[#94A3B8]">Debt ratio leverage</span>
                      <span className="text-xs font-mono font-bold text-white">{financials[0].debt_ratio}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">No balance sheet history loaded.</p>
                )}
              </div>

              {/* Financial Chart */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Revenue vs. Expenses Span</h4>
                <div className="h-48">
                  {financials.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financials} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                        <YAxis stroke="#94A3B8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar name="Revenue ($)" dataKey="revenue" fill="#2C7BE5" />
                        <Bar name="Expenses ($)" dataKey="expenses" fill="#F66D9B" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-xs text-[#94A3B8] italic flex items-center justify-center h-full">No historical charts available.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Delivery Logs */}
        {activeTab === 'delivery' && (
          <div className="space-y-6" id="detail-tab-delivery">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Recent Sourcing Orders</h4>
                
                {ordersList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#1E293B] text-[#94A3B8] pb-2 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2">Order ID</th>
                          <th className="py-2">Item Category</th>
                          <th className="py-2 text-right">Volume</th>
                          <th className="py-2 text-right">Value ($)</th>
                          <th className="py-2 text-right">Fulfillment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E293B]/50">
                        {ordersList.map(ord => (
                          <tr key={ord.order_id}>
                            <td className="py-2.5 font-mono font-semibold text-white">{ord.order_id}</td>
                            <td className="py-2.5 text-[#E2E8F0]">{ord.category}</td>
                            <td className="py-2.5 text-right font-mono text-[#E2E8F0]">{ord.quantity.toLocaleString()}</td>
                            <td className="py-2.5 text-right font-mono text-[#E2E8F0]">${ord.order_value.toLocaleString()}</td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.status === 'Delivered'
                                  ? 'bg-[#3ECF8E]/15 text-[#3ECF8E]'
                                  : ord.status === 'Delayed'
                                  ? 'bg-[#F66D9B]/15 text-[#F66D9B]'
                                  : 'bg-[#2C7BE5]/15 text-[#2C7BE5]'
                              }`}>{ord.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">No historical orders logged.</p>
                )}
              </div>

              {/* Order distribution pie */}
              <div className="md:col-span-1 space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Fulfillment Ratios</h4>
                <div className="h-40 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={orderDistribution} dataKey="value" innerRadius={35} outerRadius={50} paddingAngle={4}>
                        {orderDistribution.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-bold font-mono text-white">{ordersList.length}</span>
                    <span className="text-[8px] text-[#94A3B8] uppercase tracking-widest">Orders</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {orderDistribution.map((o, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: o.color }} />
                        <span>{o.name}</span>
                      </div>
                      <span className="font-bold text-white">{o.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Quality Controls */}
        {activeTab === 'quality' && (
          <div className="space-y-6" id="detail-tab-quality">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Quality KPIs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Quality Yield Audits</h4>
                
                {quality ? (
                  <div className="space-y-4">
                    <div className="bg-[#0B0D14] p-4 border border-[#1E293B] rounded-xl space-y-1">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">Defect PPM (Defect Rate)</span>
                      <div className="text-xl font-bold font-mono text-[#F66D9B]">{quality.defect_rate}%</div>
                      <p className="text-[10px] text-[#94A3B8]">Industry baseline target: &lt; 2.5% defect margin</p>
                    </div>

                    <div className="bg-[#0B0D14] p-4 border border-[#1E293B] rounded-xl space-y-1">
                      <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-semibold">RMA (Return Rate)</span>
                      <div className="text-xl font-bold font-mono text-white">{quality.return_rate}%</div>
                      <p className="text-[10px] text-[#94A3B8]">Unsatisfactory product returns from logistics hub</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">No quality inspection records mapped.</p>
                )}
              </div>

              {/* Complaints Log */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Customer Complaints Backlog</h4>
                
                {complaintsList.length > 0 ? (
                  <div className="space-y-3">
                    {complaintsList.map(comp => (
                      <div key={comp.complaint_id} className="p-3 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-start gap-3">
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                          comp.severity === 'Critical' ? 'text-[#F66D9B]' : 'text-yellow-500'
                        }`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-white">{comp.type}</span>
                            <span className={`text-[9px] font-bold px-1.5 rounded uppercase ${
                              comp.resolved ? 'bg-[#3ECF8E]/15 text-[#3ECF8E]' : 'bg-[#F66D9B]/15 text-[#F66D9B]'
                            }`}>
                              {comp.resolved ? 'Resolved' : 'Active'}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#94A3B8] font-mono block">Ticket: {comp.complaint_id} • Severity: {comp.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-[#0B0D14]/40 border border-[#1E293B] rounded-xl text-center text-[#94A3B8] flex flex-col items-center justify-center gap-1.5">
                    <ThumbsUp className="w-5 h-5 text-neutral-700" />
                    <span className="text-xs font-medium">Perfect track record. No active complaints registered.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Compliance */}
        {activeTab === 'compliance' && (
          <div className="space-y-6" id="detail-tab-compliance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Accreditations list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Statutory Accreditations</h4>
                
                <div className="space-y-3">
                  <div className="p-4 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white">ISO 9001 Certification</span>
                      <span className="text-[10px] text-[#94A3B8] block">Quality Management Framework standards</span>
                    </div>
                    {compliance?.iso9001 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/10">CERTIFIED</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#F66D9B]/15 text-[#F66D9B] border border-[#F66D9B]/10">PENDING</span>
                    )}
                  </div>

                  <div className="p-4 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white">ISO 14001 Certification</span>
                      <span className="text-[10px] text-[#94A3B8] block">Environmental statutory frameworks</span>
                    </div>
                    {compliance?.iso14001 ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/10">CERTIFIED</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#F66D9B]/15 text-[#F66D9B] border border-[#F66D9B]/10">PENDING</span>
                    )}
                  </div>

                  <div className="p-4 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-white">Corporate GST Registry</span>
                      <span className="text-[10px] text-[#94A3B8] block">Indirect corporate taxation status</span>
                    </div>
                    {compliance?.gst_compliant ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/10">COMPLIANT</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-[#F66D9B]/15 text-[#F66D9B] border border-[#F66D9B]/10">VIOLATION</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Regulatory Audit performance */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Sourcing Compliance Index</h4>
                
                {compliance ? (
                  <div className="bg-[#0B0D14] p-5 border border-[#1E293B] rounded-xl space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-[#94A3B8]">Statutory Audit Performance</span>
                      <span className="text-lg font-bold font-mono text-[#2C7BE5]">{compliance.audit_score}/100</span>
                    </div>

                    <div className="w-full bg-[#111420] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                      <div
                        className={`h-full rounded-full ${
                          compliance.audit_score >= 85 ? 'bg-[#3ECF8E]' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${compliance.audit_score}%` }}
                      />
                    </div>

                    <div className="border-t border-[#1E293B]/60 pt-4 flex justify-between items-center">
                      <span className="text-xs text-[#94A3B8]">Active Audit Violations</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                        compliance.violations > 0 ? 'text-[#F66D9B] bg-[#F66D9B]/15' : 'text-[#3ECF8E] bg-[#3ECF8E]/15'
                      }`}>
                        {compliance.violations} Violations
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">No compliance database active.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 5: Risk Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6" id="detail-tab-timeline">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Historical Supplier Trust Trajectory</h4>
            <div className="h-56">
              {timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111420', border: '1px solid #1E293B' }} />
                    <Line type="monotone" name="Trust Rating" dataKey="trust_score" stroke="#2C7BE5" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-[#94A3B8] italic flex items-center justify-center h-full">No timeline records loaded.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Disruption Forecast */}
        {activeTab === 'predictions' && (
          <div className="space-y-6" id="detail-tab-predictions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">AI Predictive Failure Probabilities</h4>
                
                {prediction ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs text-[#94A3B8]">Total Structural Breakdown risk</span>
                        <span className="block text-[10px] text-[#94A3B8]">Assessed operational risk within 90 days</span>
                      </div>
                      <div className="text-xl font-bold font-mono text-[#F66D9B]">{(prediction.failure_probability * 100).toFixed(0)}%</div>
                    </div>

                    <div className="p-4 bg-[#0B0D14] border border-[#1E293B] rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs text-[#94A3B8]">Model prediction confidence</span>
                        <span className="block text-[10px] text-[#94A3B8]">Confidence ratio from predictive training weights</span>
                      </div>
                      <div className="text-xl font-bold font-mono text-[#2C7BE5]">{(prediction.prediction_confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">No active failure assessments.</p>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Sourcing Disruption Metrics</h4>
                
                {prediction ? (
                  <div className="bg-[#0B0D14] p-5 border border-[#1E293B] rounded-xl space-y-4">
                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Expected Shipping Delay</span>
                      <span className="font-bold text-yellow-400 font-mono">+{prediction.delivery_delay_prediction} Days</span>
                    </div>

                    <div className="flex justify-between text-xs text-[#94A3B8]">
                      <span>Sourcing Lifecycle horizon</span>
                      <span className="font-bold text-[#E2E8F0] font-mono">{prediction.predicted_failure_months} Months</span>
                    </div>

                    <p className="text-[10px] text-[#94A3B8] leading-normal border-t border-[#1E293B] pt-3">
                      SupplyShield-AI models run predictive telemetry logs matching current port shipping bottlenecks, regional inflation index matrices, and debt leverages to formulate high-precision disruption horizons.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#94A3B8] italic">No telemetry forecast loaded.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 7: AI Recommendations */}
        {activeTab === 'recs' && (
          <div className="space-y-6" id="detail-tab-recs">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">AI Mitigation Action Plans</h4>
            
            {recommendation ? (
              <div className="p-5 bg-[#2C7BE5]/10 border border-[#2C7BE5]/20 rounded-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#2C7BE5] animate-pulse" />
                  <span className="font-bold text-white text-sm">Suggested Active Mitigation Protocol</span>
                </div>
                
                <p className="text-xs text-[#E2E8F0] leading-relaxed font-medium">
                  {recommendation.recommendation}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] border-t border-[#1E293B] pt-3 mt-2">
                  <span>Mitigation Urgency Category:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded-lg ${
                    recommendation.priority === 'Critical' ? 'text-[#F66D9B] bg-[#F66D9B]/15' : 'text-[#94A3B8] bg-[#111420]'
                  }`}>
                    {recommendation.priority} Priority
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#94A3B8] italic">No recommendations loaded.</p>
            )}
          </div>
        )}

        {/* Tab 8: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-4" id="detail-tab-documents">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Corporate Audit Contracts Backlog</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'ISO9001 Quality Audit Certificate.pdf', sz: '1.4 MB', date: '2026-03-12' },
                { name: 'Corporate Master Sourcing SLA contract.pdf', sz: '4.8 MB', date: '2026-01-10' },
                { name: 'D&B Liquidity and Corporate Solvency Report.pdf', sz: '840 KB', date: '2026-05-18' }
              ].map((doc, idx) => (
                <div key={idx} className="bg-[#0B0D14] p-4 border border-[#1E293B] rounded-xl flex items-center justify-between group hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#161926] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] group-hover:text-[#2C7BE5] transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="block text-xs font-medium text-[#E2E8F0] group-hover:text-white transition truncate max-w-[12rem]">{doc.name}</span>
                      <span className="block text-[10px] text-[#94A3B8] font-mono">{doc.sz} • Mapped {doc.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Document download simulated: ${doc.name}`)}
                    className="w-8 h-8 rounded-lg bg-[#161926] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#2C7BE5] transition cursor-pointer"
                    title="Download artifact"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

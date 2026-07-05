import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  MapPin, 
  GitCompare, 
  Sparkles, 
  Terminal, 
  CheckCircle, 
  Database, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  onEnterWorkspace: () => void;
  onInstantDemo: (company: string) => void;
}

export default function LandingView({ onEnterWorkspace, onInstantDemo }: LandingViewProps) {
  // Simulator State for the interactive landing page widget
  const [transitDelay, setTransitDelay] = useState<number>(12);
  const [tariffIndex, setTariffIndex] = useState<number>(45);
  const [scarcityFactor, setScarcityFactor] = useState<number>(1.2);

  // Compute metrics dynamically for the stress simulator
  const computedRisk = Math.min(
    100,
    Math.round((transitDelay * 3.5) + (tariffIndex * 0.4) + (scarcityFactor * 22))
  );

  const getRiskStatus = (risk: number) => {
    if (risk >= 75) return { label: 'CRITICAL HAZARD', color: 'text-[#F66D9B]', bg: 'bg-[#F66D9B]/10 border-[#F66D9B]/30' };
    if (risk >= 50) return { label: 'HIGH EXPOSURE', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    if (risk >= 30) return { label: 'MODERATE RISK', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/25' };
    return { label: 'RESILIENT', color: 'text-[#3ECF8E]', bg: 'bg-[#3ECF8E]/10 border-[#3ECF8E]/25' };
  };

  const riskStatus = getRiskStatus(computedRisk);
  
  // Calculate capital at risk
  const capitalAtRisk = (computedRisk * 84200).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const getSourcingAdvice = (risk: number) => {
    if (risk >= 75) {
      return "Initiate absolute freeze on single-source contracts. Activate strategic reserves in North American hubs and trigger redundancy failovers.";
    }
    if (risk >= 50) {
      return "Diversify logistical routes. Introduce buffer inventories (+20%) for electronic and mineral categories to offset impending delays.";
    }
    if (risk >= 30) {
      return "Monitor performance margins quarterly. Stabilize volume contracts and explore secondary logistics options as pre-emptive cover.";
    }
    return "Operations fully nominal. Leverage volume discounts and proceed with standardized containerized freight workflows.";
  };

  return (
    <div className="min-h-screen bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white relative overflow-x-hidden font-sans">
      
      {/* Absolute Decorative Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2C7BE5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#3ECF8E]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-[#1E293B]/60 bg-[#0B0D14]/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2C7BE5]/15 border border-[#2C7BE5]/30 flex items-center justify-center text-[#2C7BE5] shadow-inner shadow-slate-950/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base block">SupplyShield-AI</span>
              <span className="text-[9px] text-[#94A3B8] font-mono tracking-wider block -mt-1 uppercase">Sourcing Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#94A3B8]">
            <a href="#features" className="hover:text-white transition duration-200">System Capabilities</a>
            <a href="#stress-simulator" className="hover:text-white transition duration-200">Interactive Simulator</a>
            <a href="#performance" className="hover:text-white transition duration-200">Industry Milestones</a>
          </nav>

          {/* Access CTA */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onEnterWorkspace}
              className="text-xs font-bold text-[#E2E8F0] hover:text-white px-3.5 py-1.5 rounded-lg border border-[#1E293B] hover:border-slate-700 transition cursor-pointer"
              id="landing-signin-nav-btn"
            >
              Sign In
            </button>
            <button 
              onClick={() => onInstantDemo('Nexus Automotive Systems')}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-[#2C7BE5] text-white px-4 py-2 rounded-xl hover:bg-[#2C7BE5]/90 active:scale-[0.98] transition shadow-lg shadow-[#2C7BE5]/10 cursor-pointer"
              id="landing-demo-nav-btn"
            >
              Launch Console
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Release Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#161926] border border-[#1E293B] rounded-full px-3.5 py-1.5 text-[11px] font-mono text-[#2C7BE5] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
            <span>SupplyShield Enterprise Console v2.8 Release Ready</span>
          </div>
        </div>

        {/* Hero Typography */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15] sm:leading-none">
            Proactive Sourcing Intelligence <br />
            <span className="bg-gradient-to-r from-[#2C7BE5] via-[#4A90E2] to-[#3ECF8E] bg-clip-text text-transparent">
              & Disruption Defense
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            A comprehensive, board-ready decision-support console engineered to measure regional supplier vulnerabilities, audit SLA compliance, optimize sourcing capital, and stress-test global logistics chains. Built on resilient server architecture with Postgres Cloud SQL.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onEnterWorkspace}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2C7BE5] text-white text-xs font-bold rounded-xl hover:bg-[#2C7BE5]/90 transition active:scale-95 shadow-lg shadow-[#2C7BE5]/15 cursor-pointer"
              id="landing-enter-workspace-btn"
            >
              Enter Corporate Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onInstantDemo('Nexus Automotive Systems')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#161926] border border-[#1E293B] hover:border-slate-700 text-[#E2E8F0] hover:text-white text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer"
              id="landing-demo-portal-btn"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Instant Sandbox Demo
            </button>
          </div>
        </div>

        {/* Interactive Stress-Testing Simulator Widget (Main visual anchor) */}
        <div id="stress-simulator" className="mt-16 md:mt-24 max-w-4xl mx-auto">
          
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 md:p-8 shadow-2xl relative">
            
            {/* Visual Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#1E293B]/60">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2C7BE5] uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5" />
                  Interactive Landing Sandbox
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Global Logistic Disruption Simulator</h3>
                <p className="text-xs text-[#94A3B8]">Adjust variables to stress-test your supply routes and measure financial vulnerability</p>
              </div>
              <div className="flex items-center gap-2 bg-[#0B0D14] border border-[#1E293B] px-3.5 py-1.5 rounded-xl text-xs font-mono">
                <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
                <span className="text-[#94A3B8]">Telemetry Sandbox:</span>
                <span className="text-[#3ECF8E] font-bold">ONLINE</span>
              </div>
            </div>

            {/* Interactive Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              
              {/* Sliders Block */}
              <div className="space-y-6">
                
                {/* Transit delay */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-[#E2E8F0] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Regional Transit Delay
                    </label>
                    <span className="font-mono font-bold text-[#2C7BE5] bg-[#2C7BE5]/10 px-2 py-0.5 rounded">
                      {transitDelay} Days
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={transitDelay}
                    onChange={(e) => setTransitDelay(parseInt(e.target.value))}
                    className="w-full accent-[#2C7BE5] bg-[#0B0D14] h-1.5 rounded-lg appearance-none cursor-ew-resize"
                  />
                  <div className="flex justify-between text-[9px] text-[#94A3B8] font-mono">
                    <span>Standard freight</span>
                    <span>Severe port blockage</span>
                  </div>
                </div>

                {/* Tariff index */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-[#E2E8F0] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Tariff Volatility Index
                    </label>
                    <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      {tariffIndex}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tariffIndex}
                    onChange={(e) => setTariffIndex(parseInt(e.target.value))}
                    className="w-full accent-purple-500 bg-[#0B0D14] h-1.5 rounded-lg appearance-none cursor-ew-resize"
                  />
                  <div className="flex justify-between text-[9px] text-[#94A3B8] font-mono">
                    <span>Trade agreements clear</span>
                    <span>Heavy trade barriers</span>
                  </div>
                </div>

                {/* Scarcity factor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-[#E2E8F0] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                      Material Scarcity Coefficient
                    </label>
                    <span className="font-mono font-bold text-[#3ECF8E] bg-[#3ECF8E]/10 px-2 py-0.5 rounded">
                      {scarcityFactor.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={scarcityFactor}
                    onChange={(e) => setScarcityFactor(parseFloat(e.target.value))}
                    className="w-full accent-[#3ECF8E] bg-[#0B0D14] h-1.5 rounded-lg appearance-none cursor-ew-resize"
                  />
                  <div className="flex justify-between text-[9px] text-[#94A3B8] font-mono">
                    <span>Oversupply</span>
                    <span>Critical raw shortages</span>
                  </div>
                </div>

              </div>

              {/* Dynamic Results Display */}
              <div className="bg-[#0B0D14] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between space-y-4">
                
                {/* Score & Status */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">Sourcing Exposure Risk</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${riskStatus.bg} ${riskStatus.color}`}>
                    {riskStatus.label}
                  </span>
                </div>

                {/* Main Gauge Visual */}
                <div className="flex items-center gap-4 py-1">
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="34" stroke="#1E293B" strokeWidth="6" fill="transparent" />
                      <circle cx="40" cy="40" r="34" stroke={computedRisk >= 75 ? "#F66D9B" : computedRisk >= 50 ? "#FB923C" : computedRisk >= 30 ? "#FACC15" : "#3ECF8E"} strokeWidth="6" fill="transparent" strokeDasharray="213" strokeDashoffset={213 - (213 * computedRisk) / 100} className="transition-all duration-300" />
                    </svg>
                    <span className="absolute text-lg font-mono font-extrabold text-white">{computedRisk}%</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Estimated Financial Exposure</span>
                    <span className="block text-2xl font-mono font-extrabold text-[#F66D9B]">{capitalAtRisk}</span>
                    <span className="text-[10px] text-[#94A3B8]">Calculated capital vulnerability index</span>
                  </div>
                </div>

                {/* Simulated AI advice block */}
                <div className="border-t border-[#1E293B]/60 pt-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2C7BE5]" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white">Dynamic AI Mitigation Plan</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed italic">
                    "{getSourcingAdvice(computedRisk)}"
                  </p>
                </div>

              </div>

            </div>

            {/* Simulated CTA link */}
            <div className="mt-6 pt-4 border-t border-[#1E293B]/60 text-center">
              <button 
                onClick={() => onInstantDemo('Nexus Automotive Systems')}
                className="text-xs text-[#2C7BE5] hover:underline hover:text-[#2C7BE5]/90 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                Access full system simulator & build mitigation profiles
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* Bento Grid Core Features Section */}
      <section id="features" className="py-16 md:py-24 border-t border-[#1E293B]/40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold text-[#2C7BE5] uppercase tracking-wider font-mono">Comprehensive Auditing Framework</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Four pillars of risk & procurement control</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">Explore the analytical mechanisms integrated into the SupplyShield workspace console</p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: Risk heatmaps (Double span) */}
          <div className="md:col-span-2 bg-[#161926] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between h-80 hover:border-slate-700 transition duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Vulnerability & Disruption Heatmaps</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed max-w-md">
                Map global supply channels directly against geopolitical unrest, port blockages, and ecological bottlenecks. Find dangerous supplier geographic clusterings and receive active alerts before they impact fulfillment speeds.
              </p>
            </div>
            <div className="border-t border-[#1E293B]/60 pt-4 flex justify-between items-center text-xs text-[#94A3B8]">
              <span className="font-mono">Regional concentration metrics</span>
              <span className="text-[#2C7BE5] font-bold">Risk Matrix Module</span>
            </div>
          </div>

          {/* Feature 2: Side-by-side benchmarking */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between h-80 hover:border-slate-700 transition duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2C7BE5]/10 border border-[#2C7BE5]/30 flex items-center justify-center text-[#2C7BE5] mb-6">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Sourcing Benchmarker</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Compare balance-sheet health scores, ppm quality margins, audit violations, and historical delay ratios side-by-side across two distinct sourcing partners.
              </p>
            </div>
            <div className="border-t border-[#1E293B]/60 pt-4 flex justify-between items-center text-xs text-[#94A3B8]">
              <span className="font-mono">Direct contract matrix</span>
              <span className="text-[#2C7BE5] font-bold">Benchmark Engine</span>
            </div>
          </div>

          {/* Feature 3: PPM Yield Analytics */}
          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between h-80 hover:border-slate-700 transition duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 flex items-center justify-center text-[#3ECF8E] mb-6">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Yield Defect PPM Density</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                Gain clear visibility into manufacturing quality. Track monthly defect trends and match volumes directly against quality margins across global batch runs.
              </p>
            </div>
            <div className="border-t border-[#1E293B]/60 pt-4 flex justify-between items-center text-xs text-[#94A3B8]">
              <span className="font-mono">SLA Adherence vs Volume</span>
              <span className="text-[#3ECF8E] font-bold">Analytics Suite</span>
            </div>
          </div>

          {/* Feature 4: Strategic Capital Optimizer (Double span) */}
          <div className="md:col-span-2 bg-[#161926] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between h-80 hover:border-slate-700 transition duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Strategic Capital Advisor</h3>
              <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed max-w-md">
                Uncover real corporate saving opportunities with automated segment reviews. Access structured briefs outlining supplier redundances, volume consolidation, and risk-indexed contract renegotiations.
              </p>
            </div>
            <div className="border-t border-[#1E293B]/60 pt-4 flex justify-between items-center text-xs text-[#94A3B8]">
              <span className="font-mono">Exposure-weighted indexes</span>
              <span className="text-[#2C7BE5] font-bold">Executive Board Dashboard</span>
            </div>
          </div>

        </div>

      </section>

      {/* Stats Section */}
      <section id="performance" className="py-16 bg-[#111420]/50 border-y border-[#1E293B]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono">94.2%</span>
              <span className="block text-xs text-[#94A3B8] uppercase font-bold tracking-wider font-mono">SLA Fulfillment Index</span>
            </div>

            <div className="space-y-1">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#3ECF8E] font-mono">$4.2M+</span>
              <span className="block text-xs text-[#94A3B8] uppercase font-bold tracking-wider font-mono">Sourcing Capital Saved</span>
            </div>

            <div className="space-y-1">
              <span className="block text-2xl sm:text-3xl font-extrabold text-white font-mono">&lt; 2.4s</span>
              <span className="block text-xs text-[#94A3B8] uppercase font-bold tracking-wider font-mono">Scenario Compilation Latency</span>
            </div>

            <div className="space-y-1">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#2C7BE5] font-mono">1,240+</span>
              <span className="block text-xs text-[#94A3B8] uppercase font-bold tracking-wider font-mono">Active Auditing Hubs</span>
            </div>

          </div>
        </div>
      </section>

      {/* Sourcing domain grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">Sourcing Domains Supported</span>
          <h3 className="text-base font-bold text-white mt-1">Calibrated Across Three Enterprise Sourcing Arenas</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#161926] border border-[#1E293B]/60 p-5 rounded-xl text-left">
            <span className="text-xs font-mono text-[#2C7BE5] font-bold block mb-1">01. AEROSPACE SYSTEMS</span>
            <p className="text-xs text-[#94A3B8]">Titan titanium components, avionics processors, precision navigation hardware.</p>
          </div>
          <div className="bg-[#161926] border border-[#1E293B]/60 p-5 rounded-xl text-left">
            <span className="text-xs font-mono text-[#3ECF8E] font-bold block mb-1">02. AUTOMOTIVE NETWORKS</span>
            <p className="text-xs text-[#94A3B8]">Heavy chassis steel alloys, raw battery lithium cells, standard combustion blocks.</p>
          </div>
          <div className="bg-[#161926] border border-[#1E293B]/60 p-5 rounded-xl text-left">
            <span className="text-xs font-mono text-purple-400 font-bold block mb-1">03. GLOBAL LOGISTICS</span>
            <p className="text-xs text-[#94A3B8]">Sea-freight corridors, chemical raw lots, specialty assembly components.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="py-16 border-t border-[#1E293B]/60 bg-[#111420]/30 text-center space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">Shield your corporate supply pipeline today</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          Unlock board-level executive insights and automate proactive risk modeling. Sign in now with your enterprise identity profile or launch a demo sandbox instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <button
            onClick={onEnterWorkspace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2C7BE5] text-white text-xs font-bold rounded-xl hover:bg-[#2C7BE5]/90 active:scale-95 transition cursor-pointer"
            id="landing-footer-signin-btn"
          >
            Access Secure Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onInstantDemo('Nexus Automotive Systems')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#161926] border border-[#1E293B] hover:border-slate-700 text-[#E2E8F0] hover:text-white text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer"
            id="landing-footer-demo-btn"
          >
            Launch Free Sandbox Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B]/60 py-8 bg-[#0B0D14] text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2C7BE5]" />
            <span>SupplyShield-AI Console v2.8 • Corporate Licensed Operations</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Security Rule Matrix: <strong className="text-[#3ECF8E]">Active</strong></span>
            <span>Server: <strong className="text-[#3ECF8E]">Postgres Cloud SQL</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}

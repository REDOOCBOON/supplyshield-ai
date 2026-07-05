import React, { useState, useEffect } from 'react';
import { Sliders, HelpCircle, ShieldAlert, Sparkles, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { Supplier, SimulationResult } from '../types';

export default function SimulatorView() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedId, setSelectedId] = useState('SUP000001');
  
  // Sliders State
  const [cashFlow, setCashFlow] = useState(500000);
  const [deliveryDelay, setDeliveryDelay] = useState(2);
  const [complaints, setComplaints] = useState(0);
  const [defectRate, setDefectRate] = useState(1.2);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Load suppliers list
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/suppliers');
        const data = await res.json();
        setSuppliers(data);
        if (data.length > 0) {
          setSelectedId(data[0].supplier_id);
          // Set initial slider states based on first supplier
          const chosen = data[0];
          setCashFlow(chosen.financial_score * 10000);
          setDeliveryDelay(3);
          setComplaints(0);
          setDefectRate(chosen.quality_score > 90 ? 1.0 : 3.5);
        }
      } catch (err) {
        console.error("Error loading suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Run simulation whenever supplier or sliders change
  useEffect(() => {
    const runSimulation = async () => {
      if (!selectedId || suppliers.length === 0) return;
      
      const chosen = suppliers.find(s => s.supplier_id === selectedId);
      if (!chosen) return;

      const baselineCF = chosen.financial_score * 10000;
      const baselineDelay = 3;
      const baselineComplaints = 0;
      const baselineDefect = chosen.quality_score > 90 ? 1.0 : 3.5;

      const cash_flow_change = ((cashFlow - baselineCF) / Math.max(1, baselineCF)) * 100;
      const delivery_delay_change = deliveryDelay - baselineDelay;
      const complaints_change = complaints - baselineComplaints;
      const defect_rate_change = defectRate - baselineDefect;

      setLoading(true);
      try {
        const res = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supplier_id: selectedId,
            revenue_change: 0,
            cash_flow_change,
            delivery_delay_change,
            complaints_change,
            defect_rate_change
          })
        });

        if (res.ok) {
          const data = await res.json();
          setResult(data);
        }
      } catch (err) {
        console.error("Simulation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    runSimulation();
  }, [selectedId, cashFlow, deliveryDelay, complaints, defectRate, suppliers]);

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 bg-red-950/40 border-red-500/20';
      case 'HIGH': return 'text-orange-500 bg-orange-950/40 border-orange-500/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/20';
      default: return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20';
    }
  };

  const selectedSupplierObj = suppliers.find(s => s.supplier_id === selectedId);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-neutral-950 text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-100">AI Stress-Test Scenario Simulator</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Model balance sheet disruptions, logistics delays, and yield defects dynamically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Console Column (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm space-y-6">
            
            {/* Target Select */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Target Supplier Node</label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  // Load initial slider values from selected supplier
                  const chosen = suppliers.find(s => s.supplier_id === e.target.value);
                  if (chosen) {
                    setCashFlow(chosen.financial_score * 10000);
                    setDeliveryDelay(3);
                    setComplaints(0);
                    setDefectRate(chosen.quality_score > 90 ? 1.0 : 3.5);
                  }
                }}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-neutral-300 focus:border-cyan-500/50 outline-none cursor-pointer"
              >
                {suppliers.map(s => (
                  <option key={s.supplier_id} value={s.supplier_id}>
                    {s.supplier_name} ({s.supplier_id}) — Trust Score: {s.trust_score}
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders Container */}
            <div className="space-y-6 pt-4 border-t border-neutral-800/60" id="simulator-sliders-block">
              
              {/* Slider 1: Cash Flow */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-neutral-300">Operational Cash Flow Balance</span>
                  <span className="font-mono font-bold text-cyan-400">${cashFlow.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500000"
                  step="50000"
                  value={cashFlow}
                  onChange={(e) => setCashFlow(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-600 font-mono">
                  <span>$0 (Insolvent)</span>
                  <span>$750k (Healthy)</span>
                  <span>$1.5M (Optimal)</span>
                </div>
              </div>

              {/* Slider 2: Transport Delay */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-neutral-300">Expected Transport Delay Days</span>
                  <span className="font-mono font-bold text-cyan-400">+{deliveryDelay} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={deliveryDelay}
                  onChange={(e) => setDeliveryDelay(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-600 font-mono">
                  <span>0 Days (On-time SLA)</span>
                  <span>15 Days (Delayed)</span>
                  <span>30 Days (Disruption)</span>
                </div>
              </div>

              {/* Slider 3: Yield Defect ppm */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-neutral-300">Component Defect margin</span>
                  <span className="font-mono font-bold text-cyan-400">{defectRate}% Defect Rate</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={defectRate}
                  onChange={(e) => setDefectRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-600 font-mono">
                  <span>0% (Perfect)</span>
                  <span>7.5% (High Defect)</span>
                  <span>15% (Defective)</span>
                </div>
              </div>

              {/* Slider 4: Complaints */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-neutral-300">Active customer complaints</span>
                  <span className="font-mono font-bold text-cyan-400">{complaints} active cases</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={complaints}
                  onChange={(e) => setComplaints(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[9px] text-neutral-600 font-mono">
                  <span>0 (Clear)</span>
                  <span>5 Cases</span>
                  <span>10 Cases (Escalated)</span>
                </div>
              </div>

            </div>

          </div>

          {/* Sourcing warning note */}
          <div className="bg-neutral-900 border border-neutral-800 p-4.5 rounded-xl flex gap-3">
            <HelpCircle className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-neutral-200">How Scenario Modeling Weights Work</span>
              <p className="text-xs text-neutral-400 leading-normal">
                Adjusting variables recalibrates core neural network node scores. **Operational cash flows** heavily influence the balance sheet metrics. **Transport delays** trigger logistical penalty deductions, while **yield defects** penalize quality factors.
              </p>
            </div>
          </div>

        </div>

        {/* Real-time calculated Dial Display Column */}
        <div className="space-y-6">
          
          {/* Main simulation score dial */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between text-center min-h-[22rem]">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider self-start border-b border-neutral-800 pb-2 w-full">Modeled Output</h3>

            {loading ? (
              <div className="my-12 flex flex-col items-center justify-center text-neutral-500">
                <RefreshCw className="w-6 h-6 animate-spin mb-2 text-cyan-400" />
                <span className="text-xs font-mono">Running neural projections...</span>
              </div>
            ) : result ? (
              <>
                <div className="relative w-36 h-36 flex items-center justify-center my-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#171717" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={result.simulated_trust_score >= 80 ? '#10B981' : result.simulated_trust_score >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="263.8"
                      strokeDashoffset={263.8 - (263.8 * result.simulated_trust_score) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold font-mono text-neutral-50">{result.simulated_trust_score}</span>
                    <span className="text-[8px] text-neutral-500 uppercase tracking-widest font-bold mt-0.5">Simulated</span>
                  </div>
                </div>

                <div className="space-y-3 w-full">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded border uppercase font-mono tracking-wide ${getRiskColor(result.simulated_risk_level)}`}>
                    {result.simulated_risk_level} Risk Level
                  </span>

                  <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl text-left space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-neutral-200 uppercase tracking-wider">AI Sourcing Verdict</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                      {result.simulation_recommendation}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-500 italic my-12">Simulate metrics to display projections.</p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

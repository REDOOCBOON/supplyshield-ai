import React, { useState, useEffect } from 'react';
import { Bell, RefreshCw, CheckSquare, Square, ShieldAlert, AlertTriangle, Calendar, Check, Trash2 } from 'lucide-react';
import { Alert } from '../types';

export default function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('');
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Error loading alerts telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const toggleResolve = (id: string) => {
    if (resolvedIds.includes(id)) {
      setResolvedIds(prev => prev.filter(x => x !== id));
    } else {
      setResolvedIds(prev => [...prev, id]);
    }
  };

  const resolveAllSelected = () => {
    if (resolvedIds.length === 0) return;
    alert(`Batch Resolved: ${resolvedIds.length} telemetry alerts archived successfully.`);
    setAlerts(prev => prev.filter(a => !resolvedIds.includes(a.alert_id)));
    setResolvedIds([]);
  };

  const filteredAlerts = severityFilter
    ? alerts.filter(a => a.severity === severityFilter)
    : alerts;

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-[#0B0D14] text-[#94A3B8]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#2C7BE5]" />
        <span className="text-xs font-mono">Connecting alerts telemetry pipeline...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Live Disruption Telemetry Log</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Chronological system notifications & automated statutory alerts</p>
        </div>
        <div className="flex items-center gap-3">
          
          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#161926] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-[#E2E8F0] outline-none cursor-pointer hover:border-slate-700 transition"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
          </select>

          {resolvedIds.length > 0 && (
            <button
              onClick={resolveAllSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2C7BE5] hover:bg-[#2C7BE5]/80 text-white text-xs font-semibold cursor-pointer transition active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              Archive ({resolvedIds.length})
            </button>
          )}

        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 shadow-sm">
        
        {filteredAlerts.length === 0 ? (
          <div className="p-16 text-center text-[#94A3B8] space-y-2">
            <Check className="w-10 h-10 text-[#3ECF8E] mx-auto bg-[#3ECF8E]/15 p-2 rounded-full" />
            <h3 className="font-semibold text-white text-sm">Log cleared</h3>
            <p className="text-xs max-w-xs mx-auto">All logged events have been successfully resolved and archived into corporate cold-storage vaults.</p>
          </div>
        ) : (
          
          /* Timeline list container */
          <div className="relative border-l border-[#1E293B] pl-6 ml-3 space-y-6">
            {filteredAlerts.map((alert) => {
              const isResolved = resolvedIds.includes(alert.alert_id);
              return (
                <div key={alert.alert_id} className={`relative transition duration-200 ${isResolved ? 'opacity-40' : ''}`}>
                  
                  {/* Timeline bullet indicator */}
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-[#161926] flex items-center justify-center ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-[#F66D9B]'
                      : alert.severity === 'HIGH'
                      ? 'bg-orange-500'
                      : 'bg-yellow-500'
                  }`} />

                  {/* Card box */}
                  <div className="p-4 bg-[#0B0D14] border border-[#1E293B] hover:border-slate-700 rounded-xl transition flex items-start gap-4">
                    
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleResolve(alert.alert_id)}
                      className="text-[#94A3B8] hover:text-[#2C7BE5] mt-0.5 cursor-pointer shrink-0"
                      title={isResolved ? 'Mark as active' : 'Acknowledge alert'}
                    >
                      {isResolved ? (
                        <CheckSquare className="w-4 h-4 text-[#2C7BE5]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      
                      {/* Meta header */}
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className={`text-xs font-bold text-[#E2E8F0] ${isResolved ? 'line-through text-[#94A3B8]' : ''}`}>
                          {alert.title}
                        </h4>
                        <span className="text-[10px] text-[#94A3B8] font-mono">
                          {new Date(alert.time).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-3 pt-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-[#F66D9B]/15 text-[#F66D9B]'
                            : alert.severity === 'HIGH'
                            ? 'bg-orange-950/40 text-orange-400'
                            : 'bg-yellow-950/40 text-yellow-400'
                        }`}>
                          {alert.severity}
                        </span>
                        
                        <span className="text-[9px] text-slate-600 font-mono">
                          Ticket: {alert.alert_id}
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        )}

      </div>

    </div>
  );
}

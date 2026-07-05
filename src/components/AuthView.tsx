import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Building2, Check, RefreshCw, AlertCircle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthViewProps {
  onAuthComplete: (company: string) => void;
  onBackToLanding?: () => void;
}

export default function AuthView({ onAuthComplete, onBackToLanding }: AuthViewProps) {
  const [step, setStep] = useState<'login' | 'company' | 'loading'>('login');
  const [email, setEmail] = useState('arunavaCR7@gmail.com');
  const [password, setPassword] = useState('•••••••••');
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing SupplyShield systems...');

  const DEFAULT_COMPANIES = [
    { id: 'c1', name: 'Nexus Automotive Systems', location: 'Munich, Germany', suppliers: '1,240 Suppliers', activeSLA: '96.2% On-Time' },
    { id: 'c2', name: 'Global Sourcing Ltd', location: 'Chicago, USA', suppliers: '2,800 Suppliers', activeSLA: '94.8% On-Time' },
    { id: 'c3', name: 'Apex Electronics Corp', location: 'Singapore', suppliers: '960 Suppliers', activeSLA: '91.4% On-Time' },
  ];

  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem('supplyshield_companies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_COMPANIES;
      }
    }
    return DEFAULT_COMPANIES;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCoName, setNewCoName] = useState('');
  const [newCoLocation, setNewCoLocation] = useState('');
  const [newCoSuppliers, setNewCoSuppliers] = useState('');
  const [newCoSLA, setNewCoSLA] = useState('');
  const [formError, setFormError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your Corporate Email or Username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    // Map default placeholder to backend admin credentials
    let reqUsername = email;
    let reqPassword = password;
    if (email === 'arunavaCR7@gmail.com') {
      reqUsername = 'admin';
      reqPassword = 'admin123';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: reqUsername, password: reqPassword })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      const data = await res.json();
      localStorage.setItem('supplyshield_token', data.token);
      localStorage.setItem('supplyshield_username', data.username);
      localStorage.setItem('supplyshield_role', data.role);

      setStep('company');
    } catch (err) {
      setError('Failed to connect to the authentication server.');
    }
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newCoName.trim()) {
      setFormError('Please enter a business unit name.');
      return;
    }
    if (!newCoLocation.trim()) {
      setFormError('Please enter a headquarters location.');
      return;
    }

    const suppliersNum = parseInt(newCoSuppliers) || 0;
    const formattedSuppliers = suppliersNum.toLocaleString('en-US') + ' Suppliers';
    
    const slaNum = parseFloat(newCoSLA) || 0;
    const formattedSLA = (slaNum > 0 ? slaNum.toFixed(1) : '90.0') + '% On-Time';

    const newCompany = {
      id: 'c_' + Date.now(),
      name: newCoName.trim(),
      location: newCoLocation.trim(),
      suppliers: formattedSuppliers,
      activeSLA: formattedSLA,
    };

    const updated = [...companies, newCompany];
    setCompanies(updated);
    localStorage.setItem('supplyshield_companies', JSON.stringify(updated));

    // Clear form and close
    setNewCoName('');
    setNewCoLocation('');
    setNewCoSuppliers('');
    setNewCoSLA('');
    setShowAddForm(false);
  };

  const selectCompany = (company: string) => {
    setSelectedCompany(company);
    localStorage.setItem('supplyshield_company', company);
    setStep('loading');
  };

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onAuthComplete(selectedCompany);
            }, 500);
            return 100;
          }
          
          // Update texts during progress
          if (prev < 30) {
            setLoadingText('Connecting to regional supplier database clusters...');
          } else if (prev < 65) {
            setLoadingText('Securing cognitive models and financial analysis layers...');
          } else if (prev < 90) {
            setLoadingText('Compiling predictive risk timelines & alerts telemetry...');
          } else {
            setLoadingText('Ready. Booting SupplyShield-AI console...');
          }

          return prev + 4;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [step, selectedCompany, onAuthComplete]);

  return (
    <div className="min-h-screen bg-[#0B0D14] text-[#E2E8F0] flex items-center justify-center p-4 selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-md bg-[#161926] border border-[#1E293B] rounded-2xl p-8 shadow-2xl relative z-10"
            id="login-card"
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#2C7BE5]/10 border border-[#2C7BE5]/30 flex items-center justify-center text-[#2C7BE5] shadow-md shadow-slate-950/40">
                <Shield className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-white">SupplyShield-AI</h1>
              <p className="text-sm text-[#94A3B8] mt-2 font-medium">Enterprise Supplier Intelligence Console</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-[#F66D9B]/10 border border-[#F66D9B]/30 rounded-xl flex items-start gap-3 text-[#F66D9B] text-sm"
              >
                <AlertCircle className="w-5 h-5 text-[#F66D9B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Authorization Failed:</span> {error}
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. manager@corporation.com"
                  className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:border-[#2C7BE5]/50 focus:ring-1 focus:ring-[#2C7BE5]/30 transition outline-none"
                  id="email-input"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Access Token</label>
                  <a href="#forgot" onClick={() => setError('Password resets are managed by your Active Directory administrator.')} className="text-xs text-[#2C7BE5] hover:underline">Forgot?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:border-[#2C7BE5]/50 focus:ring-1 focus:ring-[#2C7BE5]/30 transition outline-none"
                  id="password-input"
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full bg-[#2C7BE5] hover:bg-[#2C7BE5]/90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99] shadow-lg shadow-[#2C7BE5]/10"
                  id="signin-button"
                >
                  Sign In to Workspace
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onBackToLanding && (
                  <button
                    type="button"
                    onClick={onBackToLanding}
                    className="w-full bg-transparent hover:bg-slate-900 border border-[#1E293B] hover:border-slate-700 text-[#94A3B8] hover:text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition text-xs"
                    id="back-to-landing-btn"
                  >
                    Return to Landing Page
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 border-t border-[#1E293B] pt-6 text-center text-xs text-[#94A3B8]">
              <p>SupplyShield-AI v2.8 • Licensed for Corporate Use</p>
              <p className="mt-1.5">Default Demo User: <code className="text-[#E2E8F0] bg-[#0B0D14] px-1.5 py-0.5 rounded font-mono border border-[#1E293B]">arunavaCR7@gmail.com</code></p>
            </div>
          </motion.div>
        )}

        {step === 'company' && (
          <motion.div
            key="company"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl bg-[#161926] border border-[#1E293B] rounded-2xl p-8 shadow-2xl relative z-10"
            id="company-selection-card"
          >
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#2C7BE5]/10 border border-[#2C7BE5]/30 flex items-center justify-center text-[#2C7BE5]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white">Select Business Intelligence Unit</h2>
              <p className="text-sm text-[#94A3B8] mt-2">Choose the active organizational directory to initialize</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {companies.map((co: any) => (
                <div
                  key={co.id}
                  onClick={() => selectCompany(co.name)}
                  className="bg-[#0B0D14] hover:bg-[#161926] border border-[#1E293B]/80 hover:border-[#2C7BE5]/30 rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between h-48 hover:shadow-lg hover:shadow-[#2C7BE5]/5 group animate-fadeIn"
                  id={`company-card-${co.id}`}
                >
                  <div>
                    <div className="w-8 h-8 rounded-full bg-[#161926] border border-[#1E293B] group-hover:bg-[#2C7BE5]/10 group-hover:border-[#2C7BE5]/20 flex items-center justify-center text-[#94A3B8] group-hover:text-[#2C7BE5] transition mb-4">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[#E2E8F0] group-hover:text-[#2C7BE5] transition text-sm leading-snug">{co.name}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{co.location}</p>
                  </div>
                  <div className="border-t border-[#1E293B]/60 pt-3 mt-3 flex justify-between text-xs text-[#94A3B8]">
                    <span className="font-medium">{co.suppliers}</span>
                    <span className="text-[#3ECF8E] font-bold">{co.activeSLA}</span>
                  </div>
                </div>
              ))}

              {/* Custom Add Card Trigger */}
              <div
                onClick={() => setShowAddForm(true)}
                className="bg-[#0B0D14]/40 hover:bg-[#161926]/40 border border-[#1E293B] border-dashed hover:border-[#2C7BE5]/40 rounded-2xl p-5 cursor-pointer transition flex flex-col justify-center items-center h-48 hover:shadow-lg hover:shadow-[#2C7BE5]/5 group"
                id="add-company-card-trigger"
              >
                <div className="w-9 h-9 rounded-full bg-[#161926] border border-[#1E293B] group-hover:bg-[#2C7BE5]/10 group-hover:border-[#2C7BE5]/20 flex items-center justify-center text-[#94A3B8] group-hover:text-[#2C7BE5] transition mb-3">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-[#E2E8F0] group-hover:text-[#2C7BE5] transition text-xs uppercase tracking-wider">Add Custom Unit</h3>
                <p className="text-[10px] text-[#94A3B8] mt-1 text-center px-2">Register a new global sourcing branch</p>
              </div>
            </div>

            <div className="text-center text-xs text-[#94A3B8]">
              Need access to another business unit? Contact your Workspace Administrator.
            </div>

            {/* Custom Modal overlay for registering a unit */}
            {showAddForm && (
              <div className="fixed inset-0 bg-[#0B0D14]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 shadow-2xl max-w-md w-full relative"
                  id="add-company-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#2C7BE5]/10 border border-[#2C7BE5]/20 flex items-center justify-center text-[#2C7BE5]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white">Add Business Intelligence Unit</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormError('');
                      }}
                      className="text-[#94A3B8] hover:text-white transition cursor-pointer p-1 rounded-lg hover:bg-[#0B0D14]/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddCompany} className="space-y-4 text-left">
                    {formError && (
                      <div className="bg-red-950/40 border border-red-500/20 text-[#F66D9B] text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Unit Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pacific Logistics Group"
                        value={newCoName}
                        onChange={(e) => setNewCoName(e.target.value)}
                        className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Headquarters Location</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tokyo, Japan"
                        value={newCoLocation}
                        onChange={(e) => setNewCoLocation(e.target.value)}
                        className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Suppliers Count</label>
                        <input
                          type="number"
                          placeholder="e.g. 850"
                          value={newCoSuppliers}
                          onChange={(e) => setNewCoSuppliers(e.target.value)}
                          className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Fulfillment SLA %</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="e.g. 95.4"
                          value={newCoSLA}
                          onChange={(e) => setNewCoSLA(e.target.value)}
                          className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/50 outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3 justify-end border-t border-[#1E293B] mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setFormError('');
                        }}
                        className="px-4 py-2 bg-transparent hover:bg-slate-900 border border-[#1E293B] text-xs font-semibold rounded-xl text-[#94A3B8] hover:text-white transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#2C7BE5] hover:bg-[#2C7BE5]/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-lg shadow-[#2C7BE5]/10"
                      >
                        <Plus className="w-4 h-4" />
                        Register Unit
                  </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md text-center py-12 relative z-10"
            id="loading-state-card"
          >
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-[#1E293B] border-t-[#2C7BE5] animate-spin" />
              <Shield className="w-6 h-6 text-[#2C7BE5] absolute animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-white">{selectedCompany}</h3>
            <p className="text-xs text-[#94A3B8] mt-2 font-mono h-6">{loadingText}</p>

            <div className="w-48 bg-[#161926] h-1.5 rounded-full mx-auto mt-6 border border-[#1E293B] overflow-hidden">
              <div
                className="bg-[#2C7BE5] h-full rounded-full transition-all duration-100 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-xs text-[#94A3B8] font-mono mt-2 block">{loadProgress}% Connection Established</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, ChevronDown, ChevronUp, RefreshCw, X, ArrowUpDown, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierListViewProps {
  onSupplierSelect: (id: string) => void;
  onViewChange: (view: string) => void;
}

export default function SupplierListView({ onSupplierSelect, onViewChange }: SupplierListViewProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [risk, setRisk] = useState('');
  const [status, setStatus] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<keyof Supplier>('trust_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (industry) params.append('industry', industry);
      if (country) params.append('country', country);
      if (risk) params.append('risk', risk);
      if (status) params.append('status', status);

      const res = await fetch(`/api/suppliers?${params.toString()}`);
      const data = await res.json();
      setSuppliers(data);
      setCurrentPage(1); // Reset page on filter change
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [search, industry, country, risk, status]);

  const handleSort = (field: keyof Supplier) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setIndustry('');
    setCountry('');
    setRisk('');
    setStatus('');
  };

  // Sort and paginate computed values
  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    
    // String comparisons
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    return sortOrder === 'asc' 
      ? strA.localeCompare(strB) 
      : strB.localeCompare(strA);
  });

  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const paginatedSuppliers = sortedSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const industries = ['Automotive', 'Semiconductor', 'Chemical', 'Logistics', 'Battery', 'Pharmaceutical', 'Textile', 'Packaging'];
  const countries = ['India', 'Taiwan', 'Germany', 'USA', 'China', 'Vietnam', 'UK'];

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F66D9B]/15 text-[#F66D9B] border border-[#F66D9B]/10">CRITICAL</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-500/10">HIGH</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-950/40 text-yellow-400 border border-yellow-500/10">MEDIUM</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/10">LOW</span>;
    }
  };

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'ACTIVE':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/10">Active</span>;
      case 'UNDER_REVIEW':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-950/40 text-yellow-400 border border-yellow-500/10">In Review</span>;
      case 'BLACKLISTED':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F66D9B]/15 text-[#F66D9B] border border-[#F66D9B]/10">Blacklisted</span>;
      default:
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1E293B]/40 text-[#94A3B8] border border-[#1E293B]">Inactive</span>;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Supplier Directory Database</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Filter, audit, and analyze the canonical global supplier index</p>
        </div>
        <button
          onClick={() => onViewChange('compare')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C7BE5] hover:bg-blue-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(44,123,229,0.3)] cursor-pointer transition active:scale-95"
          id="suppliers-compare-shortcut"
        >
          Compare Engine
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* Row 1: Search & Reset */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by supplier name, city, or catalog category..."
              className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#E2E8F0] placeholder:text-slate-500 focus:border-[#2C7BE5]/60 outline-none transition"
              id="supplier-search-field"
            />
          </div>

          {(industry || country || risk || status || search) && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0B0D14] border border-[#1E293B] hover:border-blue-500/30 hover:text-white text-xs text-[#94A3B8] transition cursor-pointer"
              id="clear-filters-btn"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Row 2: Select Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Industry Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Industry Sector</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/60 outline-none transition cursor-pointer"
            >
              <option value="">All Industries</option>
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>

          {/* Country Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Geographic Region</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/60 outline-none transition cursor-pointer"
            >
              <option value="">All Regions</option>
              {countries.map(cnt => <option key={cnt} value={cnt}>{cnt}</option>)}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Risk Profiling</label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/60 outline-none transition cursor-pointer"
            >
              <option value="">All Risk Tiers</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Supplier Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#E2E8F0] focus:border-[#2C7BE5]/60 outline-none transition cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="UNDER_REVIEW">In Review</option>
              <option value="BLACKLISTED">Blacklisted</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-[#161926] border border-[#1E293B] rounded-2xl overflow-hidden shadow-sm">
        
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-[#94A3B8]">
            <RefreshCw className="w-6 h-6 animate-spin mb-3 text-[#2C7BE5]" />
            <span className="text-xs font-mono">Running query pipelines...</span>
          </div>
        ) : paginatedSuppliers.length === 0 ? (
          <div className="p-16 text-center text-[#94A3B8] space-y-2">
            <ShieldAlert className="w-8 h-8 text-neutral-700 mx-auto" />
            <h3 className="font-semibold text-white text-sm">No suppliers found</h3>
            <p className="text-xs max-w-sm mx-auto">There are no records matching your active filters. Try resetting search parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111420] border-b border-[#1E293B] text-[#94A3B8] font-bold tracking-wider select-none uppercase text-[10px]">
                  <th className="px-5 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('supplier_name')}>
                    <div className="flex items-center gap-1.5">Supplier Name {sortField === 'supplier_name' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#2C7BE5]" /> : <ChevronDown className="w-3 h-3 text-[#2C7BE5]" />)}</div>
                  </th>
                  <th className="px-5 py-4">Sector</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('trust_score')}>
                    <div className="flex items-center gap-1.5">Trust Rating {sortField === 'trust_score' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-[#2C7BE5]" /> : <ChevronDown className="w-3 h-3 text-[#2C7BE5]" />)}</div>
                  </th>
                  <th className="px-5 py-4">Risk Profile</th>
                  <th className="px-5 py-4 text-center">Financials</th>
                  <th className="px-5 py-4 text-center">Delivery</th>
                  <th className="px-5 py-4 text-center">Quality</th>
                  <th className="px-5 py-4 text-center">Compliance</th>
                  <th className="px-5 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/50">
                {paginatedSuppliers.map((sup) => (
                  <tr
                    key={sup.supplier_id}
                    className="hover:bg-[#1E293B]/40 transition cursor-pointer group"
                    onClick={() => onSupplierSelect(sup.supplier_id)}
                  >
                    {/* Name */}
                    <td className="px-5 py-4.5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#E2E8F0] group-hover:text-white transition tracking-wide text-sm">{sup.supplier_name}</span>
                        <span className="block text-[10px] text-[#94A3B8] font-mono uppercase">{sup.supplier_id} • {sup.tier}</span>
                      </div>
                    </td>
                    
                    {/* Industry */}
                    <td className="px-5 py-4.5 text-[#E2E8F0]">
                      {sup.industry}
                    </td>

                    {/* Country */}
                    <td className="px-5 py-4.5 text-[#94A3B8] font-medium">
                      {sup.city}, {sup.country}
                    </td>

                    {/* Trust score */}
                    <td className="px-5 py-4.5">
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`text-sm font-bold ${
                          sup.trust_score >= 85
                            ? 'text-[#3ECF8E]'
                            : sup.trust_score >= 70
                            ? 'text-yellow-400'
                            : sup.trust_score >= 50
                            ? 'text-orange-400'
                            : 'text-[#F66D9B]'
                        }`}>{sup.trust_score}</span>
                        <span className="text-neutral-600 text-[10px]">/100</span>
                      </div>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="px-5 py-4.5">
                      {getRiskBadge(sup.risk_level)}
                    </td>

                    {/* Financial health */}
                    <td className="px-5 py-4.5 text-center font-mono font-medium text-[#E2E8F0]">
                      {sup.financial_score}%
                    </td>

                    {/* Delivery */}
                    <td className="px-5 py-4.5 text-center font-mono font-medium text-[#E2E8F0]">
                      {sup.delivery_score}%
                    </td>

                    {/* Quality */}
                    <td className="px-5 py-4.5 text-center font-mono font-medium text-[#E2E8F0]">
                      {sup.quality_score}%
                    </td>

                    {/* Compliance */}
                    <td className="px-5 py-4.5 text-center font-mono font-medium text-[#E2E8F0]">
                      {sup.compliance_score}%
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4.5 text-right">
                      {getStatusBadge(sup.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-4 bg-[#111420]/60 border-t border-[#1E293B] flex items-center justify-between select-none">
            <span className="text-xs text-[#94A3B8]">
              Showing page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span> ({suppliers.length} active records)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-[#0B0D14] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-white hover:border-[#2C7BE5]/40 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-[#0B0D14] border border-[#1E293B] text-xs text-[#94A3B8] hover:text-white hover:border-[#2C7BE5]/40 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

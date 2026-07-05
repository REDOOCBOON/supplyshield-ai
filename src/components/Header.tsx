import React from 'react';
import { Bell, ShieldCheck, ChevronRight, User, Building2 } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  selectedCompany: string;
  onViewChange: (view: string) => void;
  selectedSupplierName?: string;
  alertCount: number;
}

export default function Header({
  currentView,
  selectedCompany,
  onViewChange,
  selectedSupplierName,
  alertCount
}: HeaderProps) {
  // Map current view to breadcrumb text
  const getBreadcrumbs = () => {
    const list = [{ label: 'SupplyShield', action: () => onViewChange('dashboard') }];

    switch (currentView) {
      case 'dashboard':
        list.push({ label: 'Console Dashboard', action: () => {} });
        break;
      case 'suppliers':
        list.push({ label: 'Supplier Directory', action: () => {} });
        break;
      case 'supplier_details':
        list.push({ label: 'Supplier Directory', action: () => onViewChange('suppliers') });
        list.push({ label: selectedSupplierName || 'Supplier Details', action: () => {} });
        break;
      case 'risk':
        list.push({ label: 'Risk Center', action: () => {} });
        break;
      case 'compare':
        list.push({ label: 'Supplier Comparison', action: () => {} });
        break;
      case 'chat':
        list.push({ label: 'AI Copilot Assistant', action: () => {} });
        break;
      case 'simulate':
        list.push({ label: 'Scenario Simulator', action: () => {} });
        break;
      case 'executive':
        list.push({ label: 'Executive Insights', action: () => {} });
        break;
      case 'alerts':
        list.push({ label: 'Alerts Telemetry', action: () => {} });
        break;
      case 'analytics':
        list.push({ label: 'Analytics & Spend', action: () => {} });
        break;
      case 'reports':
        list.push({ label: 'Sourcing Reports', action: () => {} });
        break;
      case 'settings':
        list.push({ label: 'Workspace Settings', action: () => {} });
        break;
      default:
        list.push({ label: 'Console', action: () => {} });
    }

    return list;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className="bg-[#0B0D14]/80 backdrop-blur-md border-b border-[#1E293B] h-16 flex items-center justify-between px-6 sticky top-0 z-10 w-full select-none"
      id="main-header"
    >
      {/* Breadcrumbs Left Side */}
      <div className="flex items-center gap-2.5 text-xs">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />}
            <button
              onClick={crumb.action}
              className={`hover:text-white transition font-medium ${
                idx === breadcrumbs.length - 1
                  ? 'text-white cursor-default pointer-events-none font-semibold'
                  : 'text-[#94A3B8] cursor-pointer'
              }`}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Corporate Metadata & Profile Right Side */}
      <div className="flex items-center gap-6">
        
        {/* Active Corporate Tenant */}
        <div className="hidden sm:flex items-center gap-2 bg-[#1E293B]/50 border border-[#1E293B] px-3 py-1.5 rounded-lg text-xs font-medium text-white">
          <Building2 className="w-3.5 h-3.5 text-[#2C7BE5]" />
          <span>{selectedCompany}</span>
        </div>

        {/* Telemetry Alert Button */}
        <button
          onClick={() => onViewChange('alerts')}
          className="relative w-9 h-9 rounded-lg bg-[#1E293B]/50 border border-[#1E293B] hover:border-blue-500/40 flex items-center justify-center text-[#94A3B8] hover:text-white transition cursor-pointer group"
          title="Telemetry alerts backlog"
          id="header-alerts-button"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F66D9B] border-2 border-[#0B0D14] text-[9px] font-bold text-white flex items-center justify-center font-mono">
              {alertCount}
            </span>
          )}
        </button>

        {/* Session User Profile Info */}
        <div className="flex items-center gap-3 border-l border-[#1E293B] pl-6">
          <div className="hidden md:block text-right">
            <span className="block text-xs font-semibold text-white leading-tight">Arunava Sinha</span>
            <span className="block text-[10px] text-[#94A3B8] font-mono">arunavaCR7@gmail.com</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2C7BE5] to-[#3ECF8E] border-2 border-[#1E293B] flex items-center justify-center text-white text-xs font-bold font-mono">
            AS
          </div>
        </div>

      </div>
    </header>
  );
}

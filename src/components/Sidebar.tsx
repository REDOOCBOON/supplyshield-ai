import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  AlertTriangle,
  GitCompare,
  MessageSquareCode,
  Sliders,
  TrendingUp,
  Bell,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  collapsed,
  setCollapsed,
  onLogout
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Console Dashboard', icon: LayoutDashboard },
    { id: 'suppliers', label: 'Supplier Directory', icon: Users },
    { id: 'risk', label: 'Risk Center', icon: AlertTriangle, badge: 'High Risk' },
    { id: 'compare', label: 'Supplier Compare', icon: GitCompare },
    { id: 'chat', label: 'AI Chat Copilot', icon: MessageSquareCode, isAI: true },
    { id: 'simulate', label: 'Scenario Simulator', icon: Sliders },
    { id: 'executive', label: 'Executive Insights', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts Telemetry', icon: Bell, alertCount: 4 },
    { id: 'analytics', label: 'Analytics & Spend', icon: BarChart3 },
    { id: 'reports', label: 'Sourcing Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Workspace Settings', icon: Settings }
  ];

  return (
    <aside
      className={`bg-[#111420] border-r border-[#1E293B] flex flex-col justify-between transition-all duration-300 h-screen sticky top-0 shrink-0 select-none z-20 relative ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      id="main-sidebar"
    >
      {/* Brand & Toggle */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B] h-16 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#2C7BE5] flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(44,123,229,0.4)]">
              <Shield className="w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="font-bold tracking-tight text-white whitespace-nowrap text-sm">
                SupplyShield<span className="text-[#2C7BE5] font-mono text-xs ml-1">AI</span>
              </span>
            )}
          </div>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-[#0B0D14] border border-[#1E293B] hover:border-[#2C7BE5]/40 items-center justify-center text-[#94A3B8] hover:text-white transition shadow-md z-30 cursor-pointer"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition group relative cursor-pointer ${
                  isActive
                    ? 'bg-[#1E293B] text-white'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50'
                }`}
                id={`sidebar-link-${item.id}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive
                      ? 'text-white'
                      : 'text-[#94A3B8] group-hover:text-white'
                  }`}
                />
                
                {!collapsed && (
                  <span className="text-xs font-medium tracking-wide flex-1 whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {/* Badges */}
                {!collapsed && item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 font-bold rounded-full bg-[#F66D9B]/15 text-[#F66D9B] border border-[#F66D9B]/15">
                    {item.badge}
                  </span>
                )}
                {!collapsed && item.alertCount && (
                  <span className="text-[10px] font-mono font-bold w-4 h-4 rounded-full bg-[#2C7BE5] text-white flex items-center justify-center">
                    {item.alertCount}
                  </span>
                )}
                {!collapsed && item.isAI && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1E293B] text-[#2C7BE5] border border-[#2C7BE5]/25 animate-pulse uppercase tracking-wider font-mono">
                    AI
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#111420] border border-[#1E293B] rounded text-[11px] font-medium text-[#E2E8F0] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Profile Area */}
      <div className="p-3 border-t border-[#1E293B] space-y-1.5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[#94A3B8] hover:bg-[#F66D9B]/10 border border-transparent hover:border-[#F66D9B]/20 hover:text-[#F66D9B] transition group cursor-pointer"
          title={collapsed ? "Log Out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0 text-[#94A3B8] group-hover:text-[#F66D9B] transition-colors" />
          {!collapsed && <span className="text-xs font-medium tracking-wide transition-colors">Log Out Workspace</span>}
        </button>
      </div>
    </aside>
  );
}

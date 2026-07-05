/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// View Imports
import DashboardView from './components/DashboardView';
import SupplierListView from './components/SupplierListView';
import SupplierDetailView from './components/SupplierDetailView';
import RiskCenterView from './components/RiskCenterView';
import CompareView from './components/CompareView';
import AIChatView from './components/AIChatView';
import SimulatorView from './components/SimulatorView';
import ExecutiveView from './components/ExecutiveView';
import AlertsView from './components/AlertsView';
import AnalyticsView from './components/AnalyticsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Session persistence validation
  React.useEffect(() => {
    const token = localStorage.getItem('supplyshield_token');
    const savedCompany = localStorage.getItem('supplyshield_company');
    if (token && savedCompany) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      .then(res => {
        if (res.ok) {
          setSelectedCompany(savedCompany);
          setIsAuthenticated(true);
          setCurrentView('dashboard');
          setShowLanding(false);
        } else {
          localStorage.removeItem('supplyshield_token');
          localStorage.removeItem('supplyshield_company');
        }
      })
      .catch(() => {});
    }
  }, []);

  // Authentication trigger callback
  const handleLoginSuccess = (company: string) => {
    setSelectedCompany(company);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    setShowLanding(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('supplyshield_token');
    localStorage.removeItem('supplyshield_company');
    setIsAuthenticated(false);
    setSelectedCompany('');
    setSelectedSupplierId(null);
    setCurrentView('dashboard');
    setShowLanding(true);
  };

  const handleSupplierSelect = (id: string) => {
    setSelectedSupplierId(id);
    setCurrentView('supplier_details');
  };

  const handleViewChange = (view: string, targetId?: string) => {
    if (targetId) {
      setSelectedSupplierId(targetId);
    }
    setCurrentView(view);
  };

  // Render gate
  if (!isAuthenticated) {
    if (showLanding) {
      return (
        <LandingView
          onEnterWorkspace={() => setShowLanding(false)}
          onInstantDemo={(company) => {
            setSelectedCompany(company);
            setIsAuthenticated(true);
            setCurrentView('dashboard');
            setShowLanding(false);
          }}
        />
      );
    }
    return <AuthView onAuthComplete={handleLoginSuccess} onBackToLanding={() => setShowLanding(true)} />;
  }

  const selectedSupplierName = selectedSupplierId ? 'SUP0001' : undefined; // Simplified placeholder fallback for breadcrumbs

  return (
    <div className="flex bg-neutral-950 text-neutral-100 min-h-screen font-sans" id="applet-viewport">
      
      {/* Sidebar vertical rail navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header top bar */}
        <Header
          currentView={currentView}
          selectedCompany={selectedCompany}
          onViewChange={handleViewChange}
          selectedSupplierName={selectedSupplierId || undefined}
          alertCount={4}
        />

        {/* Modular View Body mounting */}
        <main className="flex-1 overflow-hidden flex flex-col bg-neutral-950">
          {currentView === 'dashboard' && (
            <DashboardView onViewChange={handleViewChange} />
          )}

          {currentView === 'suppliers' && (
            <SupplierListView
              onSupplierSelect={handleSupplierSelect}
              onViewChange={handleViewChange}
            />
          )}

          {currentView === 'supplier_details' && selectedSupplierId && (
            <SupplierDetailView
              supplierId={selectedSupplierId}
              onBack={() => setCurrentView('suppliers')}
              onViewChange={handleViewChange}
            />
          )}

          {currentView === 'risk' && (
            <RiskCenterView onViewChange={handleViewChange} />
          )}

          {currentView === 'compare' && (
            <CompareView onSupplierSelect={handleSupplierSelect} />
          )}

          {currentView === 'chat' && (
            <AIChatView />
          )}

          {currentView === 'simulate' && (
            <SimulatorView />
          )}

          {currentView === 'executive' && (
            <ExecutiveView />
          )}

          {currentView === 'alerts' && (
            <AlertsView />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView />
          )}

          {currentView === 'reports' && (
            <ReportsView />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>

      </div>

    </div>
  );
}


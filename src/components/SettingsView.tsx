import React, { useState } from 'react';
import { Settings, Shield, User, Bell, Radio, Database, Sparkles, Check } from 'lucide-react';

export default function SettingsView() {
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('YOUR_SLACK_WEBHOOK_URL');
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Configuration parameters updated. Sourcing webhooks re-indexed.");
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[#0B0D14] text-[#E2E8F0] selection:bg-[#2C7BE5]/30 selection:text-white">

      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Workspace Settings Console</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Configure alerting webhooks, database connections, and security profiles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Settings options (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">

          <form onSubmit={handleSave} className="bg-[#161926] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-6" id="settings-form">

            {/* User Session Credentials */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <User className="w-4.5 h-4.5 text-[#2C7BE5]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Identity Profile</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="block text-[10px] text-[#94A3B8] uppercase font-bold">Authorized Admin</span>
                  <input
                    type="text"
                    disabled
                    value="Arunava Sinha"
                    className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2 text-xs text-[#94A3B8] font-semibold cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] text-[#94A3B8] uppercase font-bold">Workspace Role</span>
                  <input
                    type="text"
                    disabled
                    value="Master Procurement Admin"
                    className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2 text-xs text-[#94A3B8] font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Notification Integrations Toggles */}
            <div className="space-y-4 pt-4 border-t border-[#1E293B]/60">
              <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2">
                <Bell className="w-4.5 h-4.5 text-[#2C7BE5]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Slack & Email Alerting</h3>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slackAlerts}
                    onChange={(e) => setSlackAlerts(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#2C7BE5] rounded bg-[#0B0D14] border-[#1E293B] cursor-pointer"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-white">Slack High-Risk Broadcasts</span>
                    <span className="block text-[10px] text-[#94A3B8]">Instantly broadcast critical & high risk telemetry updates to #sourcing-telemetry</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#2C7BE5] rounded bg-[#0B0D14] border-[#1E293B] cursor-pointer"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-white">Daily Executive Email Digest</span>
                    <span className="block text-[10px] text-[#94A3B8]">Receive consolidated board scorecards and risk timeline vectors at 08:00 UTC</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Webhook URLs */}
            {slackAlerts && (
              <div className="space-y-2 pt-2">
                <label className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Corporate Slack Webhook URL</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-[#0B0D14] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-[#E2E8F0] font-mono focus:border-[#2C7BE5]/50 outline-none transition"
                  id="settings-slack-webhook-field"
                />
              </div>
            )}

            {/* Submit Trigger */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#2C7BE5] hover:bg-[#2C7BE5]/90 text-white text-xs font-bold cursor-pointer transition active:scale-95 shadow-lg shadow-[#2C7BE5]/15"
              id="settings-save-btn"
            >
              <Check className="w-3.5 h-3.5" />
              Save Configuration
            </button>

          </form>

        </div>

        {/* Database integration cards column */}
        <div className="space-y-6">

          <div className="bg-[#161926] border border-[#1E293B] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2">
              <Database className="w-4 h-4 text-[#2C7BE5]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Active Integrations</h3>
            </div>

            <div className="space-y-3 font-mono text-[11px] text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Database Client:</span>
                <span className="text-[#3ECF8E] font-bold">Postgres Cloud SQL</span>
              </div>
              <div className="flex justify-between">
                <span>Host Status:</span>
                <span className="text-[#3ECF8E] font-bold">Connected (Live)</span>
              </div>
              <div className="flex justify-between">
                <span>Active Tunnel ID:</span>
                <span>TUNNEL_US_EAST_01</span>
              </div>
              <div className="flex justify-between">
                <span>Last Registry Sync:</span>
                <span>10 minutes ago</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

import React from 'react';
import { 
  DollarSign, 
  Receipt, 
  Camera, 
  Bot, 
  FileSpreadsheet, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ExpenseItem, UserProfile, SyncStatus } from '../types';
import { NavTab } from './Navigation';

interface DashboardViewProps {
  expenses: ExpenseItem[];
  user: UserProfile;
  syncStatus: SyncStatus;
  onNavigate: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  easyMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  expenses,
  user,
  syncStatus,
  onNavigate,
  onOpenAddModal,
  easyMode,
}) => {
  // Current month filtering
  const currentMonth = '2026-07';
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const taxDeductibleSpent = monthExpenses
    .filter(e => e.taxDeductible)
    .reduce((sum, e) => sum + e.amount, 0);
  const taxDeductiblePercent = totalSpent > 0 ? Math.round((taxDeductibleSpent / totalSpent) * 100) : 0;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Friendly Welcome & Quick Stat Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Smart Business Accounting</span>
            </div>
            <h2 className={`font-bold tracking-tight text-white ${easyMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              Welcome back, {user.name || 'Business Owner'}!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              All records for <strong className="text-white font-semibold">{user.companyName}</strong> are encrypted, backed up, and organized for tax filing.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('scan')}
              className="px-4 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center space-x-2"
              id="dashboard-scan-btn"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Scan Receipt AI</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-3 bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm rounded-xl border border-blue-400/40 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Monthly Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">July 2026 Spent</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {monthExpenses.length} transactions recorded
            </p>
          </div>
        </div>

        {/* Tax Deductible Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tax Write-Off Eligible</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              ${taxDeductibleSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <strong className="text-emerald-600 font-semibold">{taxDeductiblePercent}%</strong> of total expenses
            </p>
          </div>
        </div>

        {/* AI Assistant Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">AI Assistant</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
              <span>Auto-Categorize</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">Ready</span>
            </div>
            <button
              onClick={() => onNavigate('assistant')}
              className="text-xs text-blue-600 hover:underline font-semibold mt-1 inline-flex items-center space-x-1"
            >
              <span>Ask AI Tax & Categorization</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Cloud Vault & Offline Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Vault & Backup</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-1">
              <span>{syncStatus.isOnline ? 'Cloud Synced' : 'Offline Queue'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {syncStatus.pendingCount === 0 
                ? 'All receipts safely backed up' 
                : `${syncStatus.pendingCount} pending offline items`}
            </p>
          </div>
        </div>

      </div>

      {/* Easy Action Shortcuts for Non-Tech Users */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Quick Actions (One-Tap Features)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('scan')}
            className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-left group"
          >
            <Camera className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Scan Receipt</div>
            <div className="text-[11px] text-slate-500">Auto-read total & date</div>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-left group"
          >
            <Bot className="w-5 h-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">AI Assistant</div>
            <div className="text-[11px] text-slate-500">Type or dictate expense</div>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all text-left group"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Monthly Tax Report</div>
            <div className="text-[11px] text-slate-500">Export CSV & PDF</div>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-3 bg-slate-50 hover:bg-teal-50/60 rounded-xl border border-slate-200 hover:border-teal-300 transition-all text-left group"
          >
            <ShieldCheck className="w-5 h-5 text-teal-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Biometric Vault</div>
            <div className="text-[11px] text-slate-500">Cloud backups & security</div>
          </button>
        </div>
      </div>

      {/* Tax Tip Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900">
          <strong className="font-bold">Small Business Tax Tip:</strong> Always keep receipts for expenses over $75 and ensure business meals have brief notes stating the business purpose and attendees. ClearBiz Tracker automatically formats these for IRS Schedule C filing.
        </div>
      </div>

      {/* Recent Activity Table / List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Recent Business Expenses</h3>
          <button
            onClick={() => onNavigate('expenses')}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            View All ({expenses.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentExpenses.map((expense) => (
            <div key={expense.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs border border-blue-100">
                  {expense.merchant.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {expense.merchant}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-extrabold text-slate-900">
                  ${expense.amount.toFixed(2)}
                </div>
                <div className="text-[10px] flex items-center justify-end space-x-1">
                  {expense.taxDeductible ? (
                    <span className="text-emerald-600 font-medium">Tax Write-Off</span>
                  ) : (
                    <span className="text-slate-400">Non-Deductible</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

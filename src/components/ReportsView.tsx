import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  PieChart as PieChartIcon, 
  BarChart3, 
  ShieldCheck, 
  Calendar, 
  FileCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import { ExpenseItem, UserProfile } from '../types';

interface ReportsViewProps {
  expenses: ExpenseItem[];
  user: UserProfile;
  easyMode: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  expenses,
  user,
  easyMode,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Filter expenses by selected month
  const filteredExpenses = selectedMonth === 'All'
    ? expenses
    : expenses.filter((e) => e.date.startsWith(selectedMonth));

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const taxDeductibleSpent = filteredExpenses
    .filter((e) => e.taxDeductible)
    .reduce((sum, e) => sum + e.amount, 0);
  const nonDeductibleSpent = totalSpent - taxDeductibleSpent;

  // Category Aggregation for Recharts
  const categoryMap: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const categoryChartData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: Math.round(categoryMap[cat] * 100) / 100,
  }));

  const COLOR_PALETTE = [
    '#2563eb', '#10b981', '#f59e0b', '#3b82f6', 
    '#ec4899', '#14b8a6', '#06b6d4', '#f97316'
  ];

  // Daily Spending Timeline Bar Chart Data
  const dailyMap: Record<string, number> = {};
  filteredExpenses.forEach((e) => {
    const day = e.date.split('-')[2] || '01';
    dailyMap[day] = (dailyMap[day] || 0) + e.amount;
  });

  const dailyChartData = Object.keys(dailyMap)
    .sort()
    .map((day) => ({
      day: `Jul ${day}`,
      amount: Math.round(dailyMap[day] * 100) / 100,
    }));

  // CSV Export Generator
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Merchant', 'Category', 'Amount', 'Currency', 'Tax Deductible', 'Payment Method', 'Notes'];
    const rows = filteredExpenses.map((e) => [
      e.id,
      e.date,
      `"${e.merchant.replace(/"/g, '""')}"`,
      `"${e.category}"`,
      e.amount.toFixed(2),
      e.currency,
      e.taxDeductible ? 'YES' : 'NO',
      e.paymentMethod,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Business_Expenses_Report_${selectedMonth}_${user.companyName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Tax Schedule C JSON Export
  const handleExportTaxJSON = () => {
    const taxReport = {
      taxpayerName: user.name,
      companyName: user.companyName,
      taxId: user.taxId,
      period: selectedMonth,
      grossBusinessExpenses: totalSpent,
      scheduleCDeductionsTotal: taxDeductibleSpent,
      categoriesBreakdown: categoryMap,
      generatedAt: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(taxReport, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `IRS_ScheduleC_Tax_Summary_${selectedMonth}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Monthly Reports & Tax Export</h2>
          <p className="text-xs text-slate-500">
            Generate audit-ready Schedule C reports and downloadable spreadsheets for accounting & filing.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
            id="export-csv-btn"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportTaxJSON}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Tax Summary JSON</span>
          </button>

          <button
            onClick={() => setShowPdfPreview(!showPdfPreview)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{showPdfPreview ? 'Hide Printable Report' : 'Print PDF View'}</span>
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center space-x-3">
        <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
        <span className="text-xs font-bold text-slate-700">Select Accounting Period:</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
        >
          <option value="2026-07">July 2026 (Current)</option>
          <option value="2026-06">June 2026</option>
          <option value="2026-05">May 2026</option>
          <option value="All">All Time Summary</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Gross Expenses</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            ${totalSpent.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{filteredExpenses.length} transactions in period</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IRS Schedule C Deductions</span>
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            ${taxDeductibleSpent.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Eligible business write-off amount</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Non-Deductible Portion</span>
          <div className="text-2xl font-extrabold text-slate-700 mt-1">
            ${nonDeductibleSpent.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Personal or standard expenses</p>
        </div>
      </div>

      {/* Visual Recharts Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <PieChartIcon className="w-4 h-4 text-blue-600" />
            <span>Expense Distribution by Category</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px]">
            {categoryChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }} 
                />
                <span className="truncate text-slate-600">{item.name}:</span>
                <strong className="text-slate-900">${item.value.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Timeline Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Daily Spending Timeline</span>
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip formatter={(val: number) => [`$${val.toFixed(2)}`, 'Spent']} />
                <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* PDF Printable View Preview */}
      {showPdfPreview && (
        <div className="bg-white text-slate-900 rounded-2xl p-8 border border-slate-300 shadow-2xl space-y-6 printable-report">
          
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user.companyName}</h1>
              <p className="text-xs text-slate-600 mt-0.5">Taxpayer: {user.name} | Tax ID: {user.taxId}</p>
              <p className="text-xs text-slate-500">Official Monthly Expense Ledger - {selectedMonth}</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                AUDIT-READY
              </span>
              <p className="text-[11px] text-slate-400 mt-2">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl text-xs">
            <div>
              <span className="text-slate-500">Gross Expense Total:</span>
              <div className="text-lg font-extrabold text-slate-900">${totalSpent.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-slate-500">Total IRS Schedule C Deductions:</span>
              <div className="text-lg font-extrabold text-emerald-700">${taxDeductibleSpent.toFixed(2)}</div>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                <th className="py-2">Date</th>
                <th className="py-2">Merchant</th>
                <th className="py-2">Category</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-center">Tax Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="py-2">{exp.date}</td>
                  <td className="py-2 font-bold">{exp.merchant}</td>
                  <td className="py-2">{exp.category}</td>
                  <td className="py-2 text-right font-bold">${exp.amount.toFixed(2)}</td>
                  <td className="py-2 text-center">
                    {exp.taxDeductible ? 'Deductible' : 'Standard'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p>Accountant / Preparer Signature: _______________________</p>
            </div>
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg no-print"
            >
              Print This Page
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

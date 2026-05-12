import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Download, FileText, Image as ImageIcon } from 'lucide-react';
import TransactionForm from './TransactionForm';
import ReportModal from './ReportModal';

export default function TransactionList() {
  const { transactions, deleteTransaction, summary } = useFinance();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Finance_Data.csv');
    link.download = 'Finance_Data.csv';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    const content = `
      <html>
        <head>
          <title>Finance Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { color: #8b5cf6; margin-bottom: 5px; }
            .header { border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 30px; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .summary-card { padding: 20px; background: #f9fafb; border-radius: 10px; }
            .label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            .value { font-size: 20px; font-weight: bold; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; }
            td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
            .type-income { color: #10b981; font-weight: 500; }
            .type-expense { color: #ef4444; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Financial Statement</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
          <div class="summary">
            <div class="summary-card">
              <div class="label">Total Balance</div>
              <div class="value">${formatCurrency(summary.balance)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Income</div>
              <div class="value">${formatCurrency(summary.income)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Expenses</div>
              <div class="value">${formatCurrency(summary.expense)}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td>${t.description}</td>
                  <td>${t.category}</td>
                  <td class="type-${t.type}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-muted-text">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="p-2 bg-white/5 text-muted-text hover:text-primary rounded-lg border border-white/5 transition-all hover:bg-white/10"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrintReport}
              className="p-2 bg-white/5 text-muted-text hover:text-primary rounded-lg border border-white/5 transition-all hover:bg-white/10"
              title="Print Report (PDF)"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowReport(true)}
              className="p-2 bg-white/5 text-muted-text hover:text-primary rounded-lg border border-white/5 transition-all hover:bg-white/10"
              title="Share as Image (PNG)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between p-4 rounded-xl bg-background border border-white/5 hover:border-glow/30 transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2.5 rounded-xl ${
                    transaction.type === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-accent/10 text-accent'
                  } border border-white/5`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-primary transition-colors">{transaction.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-text mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5">{transaction.category}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`font-semibold text-lg ${
                    transaction.type === 'income' ? 'text-emerald-400' : 'text-accent'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
                <div className="flex opacity-0 group-hover:opacity-100 transition-all space-x-2">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="p-2 text-muted-text hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/5 hover:bg-white/10"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction._id)}
                    className="p-2 text-muted-text hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/5 hover:bg-white/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingTransaction && (
        <TransactionForm
          initialData={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      {showReport && (
        <ReportModal onClose={() => setShowReport(false)} />
      )}
    </>
  );
}

import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const { summary } = useFinance();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Balance Card */}
      <div className="card relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-300"></div>
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-muted-text font-medium">Total Balance</h3>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>

      {/* Income Card */}
      <div className="card relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-300"></div>
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-muted-text font-medium">Total Income</h3>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(summary.income)}
          </p>
        </div>
      </div>

      {/* Expense Card */}
      <div className="card relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors duration-300"></div>
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-all duration-300"></div>
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-accent/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-muted-text font-medium">Total Expense</h3>
          </div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(summary.expense)}
          </p>
        </div>
      </div>
    </div>
  );
}

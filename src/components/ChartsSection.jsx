import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

export default function ChartsSection() {
  const { transactions } = useFinance();

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const last6MonthsData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expense: 0,
      });
    }

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const m = date.getMonth();
      const y = date.getFullYear();
      
      const monthData = months.find((mo) => mo.month === m && mo.year === y);
      if (monthData) {
        if (t.type === 'income') {
          monthData.income += parseFloat(t.amount);
        } else {
          monthData.expense += parseFloat(t.amount);
        }
      }
    });

    return months;
  }, [transactions]);

  if (transactions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Category Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6 text-white">Expenses by Category</h3>
        {expensesByCategory.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff1a', borderRadius: '12px' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-text">
            No expenses to show
          </div>
        )}
      </div>

      {/* Income vs Expense Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6 text-white">Income vs Expense (6 Months)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6MonthsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#11111a', borderColor: '#ffffff1a', borderRadius: '12px' }}
                cursor={{ fill: '#ffffff0a' }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expense" name="Expense" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

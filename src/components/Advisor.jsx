import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

export default function Advisor() {
  const { transactions, summary, savingsGoal } = useFinance();

  const insights = useMemo(() => {
    const list = [];
    
    if (transactions.length === 0) {
      list.push({
        type: 'info',
        icon: <Sparkles className="w-5 h-5 text-primary" />,
        title: "Welcome aboard!",
        message: "Add your first transaction to get personalized financial advice."
      });
      return list;
    }

    // 1. Savings Rate Insight
    const savingsRate = summary.income > 0 ? ((summary.income - summary.expense) / summary.income) * 100 : 0;
    if (summary.income > 0) {
      if (savingsRate >= 20) {
        list.push({
          type: 'success',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          title: "Excellent Savings!",
          message: `You're saving ${savingsRate.toFixed(1)}% of your income. You're on the right track to building wealth.`
        });
      } else if (savingsRate > 0) {
        list.push({
          type: 'warning',
          icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
          title: "Boost your savings",
          message: `Your savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend aiming for at least 20%.`
        });
      } else {
        list.push({
          type: 'danger',
          icon: <AlertCircle className="w-5 h-5 text-accent" />,
          title: "Budget Warning",
          message: "Your expenses are currently higher than your income. Consider reviewing your Shopping and Bills categories."
        });
      }
    }

    // 2. Category Concentration Insight
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    const topCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > summary.expense * 0.4) {
      list.push({
        type: 'info',
        icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
        title: `High ${topCategory[0]} Spending`,
        message: `You've spent 40%+ of your budget on ${topCategory[0]}. Is there any way to optimize this category?`
      });
    }

    // 3. Savings Goal Insight
    if (savingsGoal > 0) {
      const progress = (summary.balance / savingsGoal) * 100;
      if (progress >= 100) {
        list.push({
          type: 'success',
          icon: <Sparkles className="w-5 h-5 text-primary" />,
          title: "Goal Reached!",
          message: "Congratulations! You've achieved your savings goal. Time to set a new target?"
        });
      } else if (progress > 50) {
        list.push({
          type: 'info',
          icon: <TrendingUp className="w-5 h-5 text-primary" />,
          title: "Halfway there!",
          message: `You've reached ${progress.toFixed(0)}% of your goal. Keep up the consistent saving!`
        });
      }
    }

    return list;
  }, [transactions, summary, savingsGoal]);

  return (
    <div className="card h-full">
      <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-white">Smart AI Advisor</h3>
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {insights.map((insight, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-background border border-white/5 hover:border-glow/20 transition-all group animate-in slide-in-from-right duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                {insight.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-1">{insight.title}</h4>
                <p className="text-xs text-muted-text leading-relaxed">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
        <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Financial Tip of the Day</p>
        <p className="text-xs text-white italic">"Don't save what is left after spending; spend what is left after saving." — Warren Buffett</p>
      </div>
    </div>
  );
}

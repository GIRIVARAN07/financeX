import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, Trash2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function Settings() {
  const { summary, savingsGoal, setSavingsGoal, clearAllData } = useFinance();
  const [goalInput, setGoalInput] = useState(savingsGoal || '');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const val = parseFloat(goalInput);
    if (!isNaN(val) && val >= 0) {
      setSavingsGoal(val);
    }
  };

  const progress = savingsGoal > 0 ? Math.min((summary.balance / savingsGoal) * 100, 100) : 0;

  return (
    <div className="card mt-8">
      <h3 className="text-lg font-semibold mb-6 text-white">Settings & Goals</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Savings Goal Tracker */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-primary mb-2">
            <Target className="w-5 h-5" />
            <h4 className="font-medium text-white">Savings Goal</h4>
          </div>
          
          <form onSubmit={handleSaveGoal} className="flex space-x-3">
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Set a goal (₹)"
              className="input-field flex-1"
              min="0"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Save Goal
            </button>
          </form>

          {savingsGoal > 0 && (
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-text">Progress</span>
                <span className="text-white font-medium">
                  {formatCurrency(summary.balance)} / {formatCurrency(savingsGoal)}
                </span>
              </div>
              <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-primary to-glow transition-all duration-500 relative"
                  style={{ width: `${Math.max(progress, 0)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                </div>
              </div>
              <p className="text-xs text-right text-muted-text">
                {Math.max(progress, 0).toFixed(1)}% Reached
              </p>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 md:border-l md:border-white/5 md:pl-8">
          <div className="flex items-center space-x-2 text-red-500 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="font-medium text-white">Danger Zone</h4>
          </div>
          
          <p className="text-sm text-muted-text mb-4">
            Permanently delete all your transactions and settings. This action cannot be undone.
          </p>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-danger w-full flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Data</span>
            </button>
          ) : (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3 animate-in fade-in">
              <p className="text-sm text-red-400 font-medium text-center">Are you absolutely sure?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-ghost flex-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearAllData();
                    setShowConfirm(false);
                  }}
                  className="btn-danger flex-1 text-sm"
                >
                  Yes, Delete All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

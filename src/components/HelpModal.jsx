import React from 'react';
import { X, HelpCircle, Info } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="card w-full max-w-2xl relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-text hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-xl">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">Finance Guide</h2>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-primary" />
              Getting Started
            </h3>
            <p className="text-muted-text text-sm leading-relaxed">
              Welcome to your Personal Finance Tracker! This tool is designed to help you gain total control over your money. 
              Start by adding your income and expenses using the <span className="text-primary font-medium">"New Transaction"</span> button in the header.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-white font-medium mb-1">Tracking Balance</h4>
              <p className="text-xs text-muted-text">Your total balance is calculated automatically as Income minus Expenses. Watch the neon cards for real-time updates.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-white font-medium mb-1">Savings Goals</h4>
              <p className="text-xs text-muted-text">Set a target amount in the Settings section. Our advisor will track your progress and give you tips to reach it faster.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy & Security</h3>
            <p className="text-muted-text text-sm leading-relaxed">
              Your financial data is <span className="text-white font-medium">Safe & Secure</span>. We don't store your data on any servers; 
              everything stays strictly on your browser's local storage. This means your information never leaves your device.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <button onClick={onClose} className="btn-primary w-full">
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatCurrency';
import { X, Download, Share2, Activity, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function ReportModal({ onClose }) {
  const { transactions, summary, user } = useFinance();
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadImage = async () => {
    if (!reportRef.current || !window.domtoimage) return;
    setIsExporting(true);
    
    try {
      // Create the image as a Blob for maximum compatibility
      const blob = await window.domtoimage.toBlob(reportRef.current, {
        bgcolor: '#0a0a0a',
        width: reportRef.current.offsetWidth,
        height: reportRef.current.offsetHeight,
        style: { borderRadius: '2.5rem' }
      });
      
      if (!blob) throw new Error('Failed to generate image blob');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Finance_Report.png');
      link.download = 'Finance_Report.png';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (err) {
      console.error('Failed to export image:', err);
      // Ultimate Fallback: Open as Image in New Tab
      try {
        const dataUrl = await window.domtoimage.toPng(reportRef.current);
        const win = window.open();
        win.document.write(`
          <body style="margin:0; background:#0a0a0a; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; color:white; font-family:sans-serif;">
            <img src="${dataUrl}" style="max-width:90%; border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1);" />
            <p style="margin-top:20px; opacity:0.7;">Right-click the image and select <b>"Save image as..."</b></p>
            <button onclick="window.close()" style="margin-top:10px; padding:8px 20px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; border-radius:8px; cursor:pointer;">Close Preview</button>
          </body>
        `);
      } catch (innerErr) {
        alert('Please take a screenshot of the report to share it.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Calculate top categories
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-2xl w-full relative">
        {/* Modal Controls */}
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Report Preview (v2)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log('Generating report...');
                handleDownloadImage();
              }}
              disabled={isExporting}
              className="btn-primary py-2 px-4 flex items-center gap-2 text-sm disabled:opacity-50 shadow-neon-strong"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? 'Processing...' : 'GENERATE IMAGE REPORT'}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 text-muted-text hover:text-white rounded-lg border border-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Report Card (Captured as Image) */}
        <div 
          ref={reportRef}
          className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl"
          style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 rounded-xl border border-primary/20">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Financial Summary</h1>
                  <p className="text-sm text-muted-text uppercase tracking-widest font-medium opacity-70">
                    {user?.name || 'Personal'} • {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-text uppercase tracking-tighter">Current Balance</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(summary.balance)}</p>
              </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <TrendingUp className="w-12 h-12 text-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-emerald-400 uppercase mb-1">Total Income</p>
                <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(summary.income)}</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <TrendingDown className="w-12 h-12 text-accent" />
                </div>
                <p className="text-xs font-semibold text-accent uppercase mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-white tracking-tight">{formatCurrency(summary.expense)}</p>
              </div>
            </div>

            {/* Top Categories */}
            {topCategories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-text uppercase tracking-widest mb-4 px-1">Top Spending</h3>
                <div className="space-y-3">
                  {topCategories.map(([cat, amount], idx) => (
                    <div key={cat} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-accent' : 'bg-white/40'}`}></div>
                        <span className="text-white font-medium">{cat}</span>
                      </div>
                      <span className="text-white/80 font-bold">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2 opacity-50">
                <Wallet className="w-4 h-4 text-white" />
                <span className="text-[10px] text-white uppercase tracking-widest font-bold">Finance Tracker Premium</span>
              </div>
              <p className="text-[10px] text-muted-text">Verified Statement • {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-muted-text text-sm mt-6 animate-pulse">
          Click Download to save this beautiful report as a PNG image
        </p>
      </div>
    </div>
  );
}

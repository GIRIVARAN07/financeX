import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import ChartsSection from './components/ChartsSection';
import Settings from './components/Settings';
import Login from './components/Login';
import HelpModal from './components/HelpModal';
import Advisor from './components/Advisor';
import AdminPanel from './components/AdminPanel';
import { Activity, Plus, LogOut, HelpCircle, Shield } from 'lucide-react';

function AppContent({ user, setUser, handleLogin, handleLogout }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'admin'

  const isAdmin = user?.email === 'admin@gmail.com';

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} onShowHelp={() => setShowHelp(true)} />
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </>
    );
  }

  if (view === 'admin' && isAdmin) {
    return <AdminPanel onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/30">
      {/* Background Glow Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/20 rounded-xl shadow-neon border border-primary/20">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Finance Tracker</h1>
              <p className="text-sm text-primary animate-pulse-slow">Welcome back, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center space-x-2 flex-1 md:flex-none justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>New Transaction</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setView('admin')}
                className="p-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl border border-primary/20 transition-all"
                title="Admin Panel"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setShowHelp(true)}
              className="p-2.5 bg-white/5 text-muted-text hover:text-primary rounded-xl border border-white/5 transition-colors"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-white/5 text-muted-text hover:text-white rounded-xl border border-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Dashboard />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ChartsSection />
                <Advisor />
              </div>
              <Settings />
            </div>
            <div className="lg:col-span-1">
              <TransactionList />
            </div>
          </div>
        </main>
      </div>

      {showAddForm && <TransactionForm onClose={() => setShowAddForm(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useLocalStorage('finance_user', null);

  const handleLogin = (userData) => {
    setUser({ ...userData, loginDate: new Date().toISOString() });
  };

  const handleLogout = () => {
    localStorage.removeItem('finance_token');
    setUser(null);
  };

  return (
    <FinanceProvider key={user?.name || 'guest'} user={user}>
      <AppContent 
        user={user} 
        setUser={setUser} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout} 
      />
    </FinanceProvider>
  );
}

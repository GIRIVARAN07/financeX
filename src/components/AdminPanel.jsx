import React, { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Trash2, User, Search, Database, Users } from 'lucide-react';

export default function AdminPanel({ onBack }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, totalSize: 0 });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const registry = JSON.parse(localStorage.getItem('finance_users_registry') || '[]');
    setUsers(registry);
    
    // Calculate storage stats
    let totalChars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      totalChars += key.length + localStorage.getItem(key).length;
    }
    
    setStats({
      totalUsers: registry.length,
      totalSize: (totalChars * 2) / 1024 // Rough KB estimate (UTF-16)
    });
  };

  const deleteUser = (email) => {
    if (email === 'admin@gmail.com') {
      alert("Cannot delete the master admin account.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete user ${email}? This will also delete their transaction history if you clear their specific keys.`)) {
      const registry = JSON.parse(localStorage.getItem('finance_users_registry') || '[]');
      const updatedRegistry = registry.filter(u => u.email !== email);
      localStorage.setItem('finance_users_registry', JSON.stringify(updatedRegistry));
      
      // Also cleanup user's specific data
      const userName = registry.find(u => u.email === email)?.name;
      if (userName) {
        localStorage.removeItem(`finance_transactions_${userName}`);
        localStorage.removeItem(`finance_savings_goal_${userName}`);
      }
      
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden selection:bg-blue-500/30 p-4 md:p-8">
      {/* Admin Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-blue-500/5 text-slate-400 hover:text-white rounded-lg border border-blue-500/10 transition-all hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/10 rounded-lg border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight font-mono">CORE_ADMIN_CENTER</h1>
                <p className="text-xs text-blue-400 uppercase tracking-[0.3em] font-bold opacity-70">System Integrity & Node Management</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/50 backdrop-blur-md p-6 border border-blue-500/10 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-16 h-16 text-blue-400" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active_Nodes</p>
            <p className="text-4xl font-mono font-bold text-white tracking-tighter">{stats.totalUsers}</p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-md p-6 border border-blue-500/10 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Database className="w-16 h-16 text-cyan-400" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Storage_Load</p>
            <p className="text-4xl font-mono font-bold text-white tracking-tighter">{stats.totalSize.toFixed(2)} <span className="text-lg">KB</span></p>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-md p-6 border border-blue-500/10 rounded-xl bg-blue-500/5 border-l-4 border-l-blue-500">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Control_Status</p>
            <p className="text-4xl font-mono font-bold text-cyan-400 tracking-tighter italic">ONLINE</p>
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-blue-500/10 shadow-2xl">
          <div className="p-6 border-b border-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-500/[0.02]">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 font-mono">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              User_Registry
            </h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Query nodes by ID or identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950/50 border border-blue-500/20 rounded-lg pl-10 pr-4 py-2 w-full md:w-80 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/30 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 border-b border-blue-500/5">Identity</th>
                  <th className="px-6 py-4 border-b border-blue-500/5">Endpoint</th>
                  <th className="px-6 py-4 border-b border-blue-500/5">Access_Level</th>
                  <th className="px-6 py-4 border-b border-blue-500/5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/5">
                {filteredUsers.map((u) => (
                  <tr key={u.email} className="group hover:bg-blue-500/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-mono text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-300">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${u.email === 'admin@gmail.com' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                        {u.email === 'admin@gmail.com' ? 'ROOT_ADMIN' : 'STANDARD'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteUser(u.email)}
                        disabled={u.email === 'admin@gmail.com'}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                        title="Terminate Session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-muted-text">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Activity, Lock, User } from 'lucide-react';

export default function Login({ onLogin, onShowHelp }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid Gmail address.');
      return;
    }

    setIsLoading(true);
    setError('');

    const API_URL = 'http://localhost:5000/api/auth';

    setTimeout(async () => {
      try {
        const endpoint = isSignUp ? '/register' : '/login';
        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Authentication failed');
          setIsLoading(false);
          return;
        }

        // Store token for API requests
        localStorage.setItem('finance_token', data.token);
        onLogin(data.user);
      } catch (err) {
        setError('Connection failed. Is the server running?');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px] pointer-events-none"></div>

      <div className="card w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500 shadow-2xl">
        <button 
          onClick={onShowHelp}
          className="absolute top-4 right-4 p-2 text-muted-text hover:text-primary transition-colors bg-white/5 rounded-lg border border-white/5"
          title="Help"
        >
          <Activity className="w-4 h-4 rotate-180" /> {/* Help Icon Mock */}
        </button>
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/20 rounded-2xl shadow-neon border border-primary/20 mb-4 transition-transform hover:scale-110 duration-300">
            <Activity className={`w-10 h-10 text-primary ${isLoading ? 'animate-pulse' : ''}`} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Finance Tracker</h1>
          <p className="text-muted-text mt-1 text-sm">
            {isSignUp ? 'Create your secure account' : 'Experience Secure Finance Tracking'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <label className="block text-sm font-medium text-muted-text mb-1.5">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="Enter your name"
                  className="input-field pl-12"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <label className="block text-sm font-medium text-muted-text mb-1.5">Gmail Address</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="example@gmail.com"
                className="input-field pl-12"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={isLoading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            <label className="block text-sm font-medium text-muted-text mb-1.5">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="input-field pl-12"
                disabled={isLoading}
              />
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-white/10 bg-background text-primary focus:ring-primary transition-all cursor-pointer"
                />
                <span className="text-xs text-muted-text group-hover:text-text transition-colors">Remember me</span>
              </label>
            </div>
          )}

          <div className="flex gap-4 mt-2">
            <button 
              type="submit" 
              className="btn-primary flex-1 py-3 text-lg relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Creating...' : 'Verifying...'}</span>
                </div>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
            {!isLoading && (
              <button 
                type="button" 
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                className="btn-ghost flex-1 py-3 text-lg border border-white/10 hover:border-primary/50"
              >
                {isSignUp ? 'Back to Login' : 'Register'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-text uppercase tracking-widest">Secure & Safe</p>
          <div className="flex justify-center space-x-1 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

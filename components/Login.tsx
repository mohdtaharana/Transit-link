
import React, { useState } from 'react';
import { Command, Shield, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated auth logic
    setTimeout(() => {
      if (username === 'taharana' && password === 'taha1234') {
        onLogin({
          id: 'admin-01',
          name: 'Taha Rana',
          role: 'Admin',
          token: 'khi-secure-token'
        });
      } else {
        setError('Invalid credentials. Check node access key.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-600/20 mb-6">
              <Command className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Transit Link</h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Command Auth</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Identity</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                  <UserIcon size={18} />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="Username"
                  className="w-full bg-slate-800/50 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encrypted Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full bg-slate-800/50 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white font-bold outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? 'Decrypting...' : 'Initiate Session'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <Shield size={12} />
              Secured by Karachi_Kernel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

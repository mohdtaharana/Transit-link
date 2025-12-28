
import React from 'react';
import { Shield, Terminal, ShieldAlert, Lock, Cpu, Globe } from 'lucide-react';

const SecurityLogs = () => {
  const logs = [
    { id: 1, action: 'Asset Registry Update', user: 'Admin-KHI', status: 'Success', time: '2 mins ago', ip: '192.168.1.104' },
    { id: 2, action: 'GPS Signal Restored', user: 'Vehicle-KHI-2938', status: 'Event', time: '14 mins ago', ip: '10.0.8.22' },
    { id: 3, action: 'Login Attempt - Root', user: 'Dispatcher-02', status: 'Blocked', time: '1 hour ago', ip: '172.16.0.45' },
    { id: 4, action: 'Node Sync Complete', user: 'Central-Server', status: 'Success', time: '2 hours ago', ip: 'localhost' },
    { id: 5, action: 'Encrypted Handshake', user: 'Node-KHI-4421', status: 'Success', time: '3 hours ago', ip: '10.0.4.12' },
    { id: 6, action: 'Geo-Fence Breach', user: 'System-Auto', status: 'Alert', time: '5 hours ago', ip: 'internal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Command</h2>
          <p className="text-sm text-slate-500 font-medium italic">End-to-end encrypted node monitoring // Karachi Central</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-green-100 self-start sm:self-auto">
          <Shield size={14} className="animate-pulse" /> 
          Verified Secure
        </div>
      </div>

      {/* Responsive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-inner"><Terminal size={22} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</p>
            <p className="text-lg font-black text-slate-800">12 Active Sessions</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 shadow-inner"><Lock size={22} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption</p>
            <p className="text-lg font-black text-slate-800">AES-256 GCM</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="bg-red-50 p-3 rounded-2xl text-red-600 shadow-inner"><ShieldAlert size={22} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Threat Level</p>
            <p className="text-lg font-black text-red-600">Low Protocol</p>
          </div>
        </div>
      </div>

      {/* Adaptive Terminal View */}
      <div className="bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <span className="hidden sm:inline text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold">
              Kernel :: Node_Logs_karachi_v3.2
            </span>
            <span className="sm:hidden text-[9px] font-mono text-slate-500 uppercase font-bold">Logs</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-[9px] font-mono text-blue-400/80 uppercase font-bold">
                <Cpu size={10} /> <span className="hidden xs:inline">System Ready</span>
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400/80 uppercase font-bold">
                <Globe size={10} /> <span className="hidden xs:inline">Distributed</span>
             </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 space-y-2 font-mono overflow-x-auto">
          {logs.map(log => (
            <div key={log.id} className="flex flex-col sm:grid sm:grid-cols-5 gap-1 sm:gap-4 p-3 sm:p-2.5 hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-800 group">
              <div className="flex items-center justify-between sm:block">
                <span className="text-[10px] text-slate-500 font-bold">{log.time}</span>
                <span className="sm:hidden text-[9px] font-black text-slate-700 uppercase tracking-tighter">[{log.ip}]</span>
              </div>
              <div className="flex items-center gap-2 sm:block">
                <span className="text-xs text-blue-400 font-black">{log.action}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] text-slate-400 font-medium">{log.user}</span>
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  log.status === 'Success' ? 'text-green-500 bg-green-500/10' : 
                  log.status === 'Blocked' ? 'text-red-500 bg-red-500/10' : 
                  log.status === 'Alert' ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 bg-slate-400/10'
                }`}>{log.status}</span>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-slate-600 font-bold group-hover:text-slate-400 transition-colors">{log.ip}</span>
              </div>
              {/* Mobile sub-info */}
              <div className="sm:hidden flex items-center justify-between pt-1 border-t border-slate-900 mt-1">
                <span className="text-[9px] text-slate-600">{log.user}</span>
                <span className="text-[9px] text-slate-700 font-mono">{log.ip}</span>
              </div>
            </div>
          ))}
          <div className="pt-4 flex items-center gap-2 text-green-500/60 text-[10px] font-bold animate-pulse px-2">
            <span className="w-1 h-3 bg-green-500/60"></span>
            SYNC_NODE_KARACHI_SUCCESS :: Awaiting next telemetry packet...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityLogs;

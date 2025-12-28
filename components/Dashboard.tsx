
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Vehicle } from '../types';
import { APP_THEME } from '../constants';
import { TrendingUp, AlertCircle, Clock, Truck, ShieldCheck, Zap } from 'lucide-react';

interface DashboardProps {
  vehicles: Vehicle[];
  alerts: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ vehicles, alerts }) => {
  const activeCount = vehicles.filter(v => v.status === 'Active').length;
  const idleCount = vehicles.filter(v => v.status === 'Idle').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;

  const statusData = [
    { name: 'Active', value: activeCount, color: APP_THEME.success },
    { name: 'Idle', value: idleCount, color: APP_THEME.warning },
    { name: 'Maint.', value: maintenanceCount, color: APP_THEME.danger },
  ];

  const stats = [
    { label: 'Fleet Size', value: vehicles.length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Live Nodes', value: activeCount, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Alerts', value: alerts.length, icon: AlertCircle, color: alerts.length > 0 ? 'text-red-600' : 'text-slate-400', bg: alerts.length > 0 ? 'bg-red-50' : 'bg-slate-50' },
    { label: 'Security', value: '100%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Command Center</h2>
          <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">Real-time کراچی transit telemetry</p>
        </div>
        <div className="flex">
          <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            Node Central: KHI-X01
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl md:text-2xl font-black mt-1 text-slate-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operational Mix */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-black text-slate-900 tracking-tight">Operational Mix</h4>
            <Clock size={16} className="text-slate-400" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} width={50} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Pulse & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Alerts List */}
          {alerts.length > 0 && (
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-[2rem] animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-red-600 animate-pulse" />
                <h4 className="font-black text-red-900 tracking-tight text-sm uppercase">Active Incident Pulse</h4>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/80 p-4 rounded-2xl border border-red-200 shadow-sm">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                       <p className="text-xs font-bold text-red-800">{alert.message}</p>
                    </div>
                    <span className="text-[10px] font-black text-red-400">{alert.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-slate-900 tracking-tight">Telemetry Stream</h4>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-widest">Active Link</span>
            </div>
            <div className="space-y-3">
              {vehicles.slice(0, 4).map((v, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${v.status === 'Active' ? 'bg-green-500 animate-pulse' : v.status === 'Idle' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-black text-xs md:text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{v.regNumber}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-tighter">{v.type} • {v.driverName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] md:text-xs font-mono font-black text-slate-800">
                      {v.lastLocation.lat.toFixed(4)}, {v.lastLocation.lng.toFixed(4)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.05em] mt-0.5">GPS Fixed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

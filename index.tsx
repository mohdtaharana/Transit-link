import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FleetManagement from './components/FleetManagement';
import LiveTracking from './components/LiveTracking';
import SecurityLogs from './components/SecurityLogs';
import Architecture from './components/Architecture';
import Login from './components/Login';
import { Vehicle, User } from './types';
import { api } from './services/api';
import { INITIAL_VEHICLES } from './constants';
import { Menu, Command, AlertTriangle, RefreshCw, Bell, WifiOff, Database } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'transitlink_fallback_data';

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Persistence Logic: Load fallback data if exists, otherwise use constants
  const getFallbackData = (): Vehicle[] => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  };

  const saveToFallback = (data: Vehicle[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  // Alert Logic Engine
  const alerts = useMemo(() => {
    const generatedAlerts: any[] = [];
    vehicles.forEach(v => {
      if (v.status === 'Maintenance') {
        generatedAlerts.push({
          id: `alert-${v.id}`,
          type: 'CRITICAL',
          message: `Unit ${v.regNumber} offline for maintenance.`,
          node: v.regNumber,
          time: 'Just now'
        });
      }
      if (v.status === 'Idle') {
        generatedAlerts.push({
          id: `idle-${v.id}`,
          type: 'WARNING',
          message: `Node ${v.regNumber} is stationary.`,
          node: v.regNumber,
          time: '5 mins ago'
        });
      }
    });
    return generatedAlerts;
  }, [vehicles]);

  const fetchRegistry = async () => {
    setLoading(true);
    try {
      const data = await api.getVehicles();
      setVehicles(data);
      saveToFallback(data); // Sync local with backend
      setIsOffline(false);
    } catch (err) {
      console.warn('BACKEND_OFFLINE: Reverting to Local Storage Protocol');
      setVehicles(getFallbackData());
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRegistry();
    }
  }, [currentUser]);

  const handleAddVehicle = async (vehicle: Vehicle) => {
    if (isOffline) {
      const updated = [...vehicles, vehicle];
      setVehicles(updated);
      saveToFallback(updated);
    } else {
      try {
        const saved = await api.addVehicle(vehicle);
        setVehicles(prev => [...prev, saved]);
      } catch (err: any) {
        setIsOffline(true);
        const updated = [...vehicles, vehicle];
        setVehicles(updated);
        saveToFallback(updated);
      }
    }
  };

  const handleUpdateVehicle = async (updated: Vehicle) => {
    if (isOffline) {
      const newList = vehicles.map(v => v.id === updated.id ? updated : v);
      setVehicles(newList);
      saveToFallback(newList);
    } else {
      try {
        const saved = await api.updateVehicle(updated);
        setVehicles(prev => prev.map(v => v.id === saved.id ? saved : v));
      } catch (err: any) {
        const newList = vehicles.map(v => v.id === updated.id ? updated : v);
        setVehicles(newList);
        saveToFallback(newList);
        setIsOffline(true);
      }
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (isOffline) {
      const updated = vehicles.filter(v => v.id !== id);
      setVehicles(updated);
      saveToFallback(updated);
    } else {
      try {
        await api.deleteVehicle(id);
        setVehicles(prev => prev.filter(v => v.id !== id));
      } catch (err: any) {
        const updated = vehicles.filter(v => v.id !== id);
        setVehicles(updated);
        saveToFallback(updated);
        setIsOffline(true);
      }
    }
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">Syncing Karachi_Grid...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard vehicles={vehicles} alerts={alerts} />;
      case 'fleet': return <FleetManagement vehicles={vehicles} onAdd={handleAddVehicle} onUpdate={handleUpdateVehicle} onDelete={handleDeleteVehicle} />;
      case 'tracking': return <LiveTracking vehicles={vehicles} onSync={fetchRegistry} />;
      case 'architecture': return <Architecture />;
      case 'security': return <SecurityLogs />;
      default: return <Dashboard vehicles={vehicles} alerts={alerts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} onLogout={() => setCurrentUser(null)} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-95 transition-transform">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Command size={18} className="text-blue-600" />
              <h1 className="font-black text-slate-900 tracking-tighter uppercase text-sm">TransitLink</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {isOffline ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full">
                  <WifiOff size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Local Storage Mode</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-full">
                  <Database size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Live Backend Connected</span>
                </div>
              )}
            </div>
            <div className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <Bell size={20} className="text-slate-600" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full"></span>
              )}
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
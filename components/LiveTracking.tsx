
import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Vehicle } from '../types';
import { KARACHI_BOUNDS } from '../constants';
import { MapPin, Info, Navigation, Search, List, ChevronRight, X, RefreshCw, History } from 'lucide-react';

interface LiveTrackingProps {
  vehicles: Vehicle[];
  onSync: (id: string) => void;
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ vehicles, onSync }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const historyLinesRef = useRef<{ [key: string]: L.Polyline }>({});
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showList, setShowList] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Functional Search Filtering
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      v.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicles, searchTerm]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(
      KARACHI_BOUNDS.center,
      KARACHI_BOUNDS.zoom
    );

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    vehicles.forEach(vehicle => {
      const { lat, lng } = vehicle.lastLocation;
      
      // Update Marker
      if (markersRef.current[vehicle.id]) {
        markersRef.current[vehicle.id].setLatLng([lat, lng]);
      } else {
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative group">
              <div class="w-10 h-10 rounded-full bg-white shadow-2xl border-2 ${vehicle.status === 'Active' ? 'border-blue-600' : 'border-slate-400'} flex items-center justify-center transition-all hover:scale-125 hover:z-50">
                <div class="w-8 h-8 rounded-full ${vehicle.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'} flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="10" x="2" y="6" rx="2"/><path d="M16 19h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </div>
                ${vehicle.status === 'Active' ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>' : ''}
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current!);
        marker.on('click', () => {
          setSelectedVehicle(vehicle);
          if (window.innerWidth < 1024) setShowList(false);
        });
        markersRef.current[vehicle.id] = marker;
      }

      // Update History Line
      if (showHistory && selectedVehicle?.id === vehicle.id) {
        const points = vehicle.history.map(p => [p.lat, p.lng] as [number, number]);
        if (historyLinesRef.current[vehicle.id]) {
          historyLinesRef.current[vehicle.id].setLatLngs(points);
        } else {
          historyLinesRef.current[vehicle.id] = L.polyline(points, {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.6,
            dashArray: '5, 10',
            lineJoin: 'round'
          }).addTo(mapRef.current!);
        }
      } else if (historyLinesRef.current[vehicle.id]) {
        // Remove if not selected or history hidden
        historyLinesRef.current[vehicle.id].remove();
        delete historyLinesRef.current[vehicle.id];
      }
    });

    // Handle auto-focus update if selected
    if (selectedVehicle) {
      const updated = vehicles.find(v => v.id === selectedVehicle.id);
      if (updated && (updated.lastLocation.lat !== selectedVehicle.lastLocation.lat)) {
        setSelectedVehicle(updated);
      }
    }
  }, [vehicles, showHistory, selectedVehicle]);

  const focusOnVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    setShowHistory(false);
    mapRef.current?.flyTo([v.lastLocation.lat, v.lastLocation.lng], 16, { animate: true, duration: 1.2 });
    if (window.innerWidth < 1024) setShowList(false);
  };

  const handleSyncClick = () => {
    if (!selectedVehicle) return;
    setIsSyncing(true);
    onSync(selectedVehicle.id);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  return (
    <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-4 md:gap-6 overflow-hidden relative">
      <div className={`absolute lg:relative z-30 lg:z-auto transition-all duration-500 ease-in-out inset-y-0 left-0 w-72 xs:w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl lg:shadow-sm flex flex-col ${showList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white"><List size={16} /></div> 
            Live Nodes
          </h3>
          <button onClick={() => setShowList(false)} className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Karachi Grid..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-10 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map(v => (
              <button
                key={v.id}
                onClick={() => focusOnVehicle(v)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 border-2 ${
                  selectedVehicle?.id === v.id ? 'bg-blue-50 border-blue-200 shadow-inner' : 'border-transparent hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 ${
                  v.status === 'Active' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}>
                  <Navigation size={22} className={v.status === 'Active' ? 'animate-pulse' : ''} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate text-slate-900 tracking-tight">{v.regNumber}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{v.type} • {v.status}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="inline-flex p-4 bg-slate-50 rounded-2xl text-slate-300">
                <Search size={24} />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-relaxed">
                No telemetry nodes match your search query
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
        <div ref={mapContainerRef} className="h-full w-full z-10" />
        
        {!showList && (
          <button 
            onClick={() => setShowList(true)}
            className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md shadow-2xl p-4 rounded-2xl border border-slate-200 lg:hidden text-blue-600 animate-in fade-in zoom-in duration-300"
          >
            <List size={22} />
          </button>
        )}

        {selectedVehicle && (
          <div className="absolute inset-x-4 top-4 sm:inset-x-auto sm:right-4 z-20 sm:w-80 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white animate-in fade-in slide-in-from-top-6 duration-500">
            <div className="flex justify-between items-start mb-5">
              <div className="flex-1 pr-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${selectedVehicle.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  Node_Stream_{selectedVehicle.status}
                </span>
                <h5 className="font-black text-slate-900 text-xl mt-2 tracking-tighter leading-none">{selectedVehicle.regNumber}</h5>
              </div>
              <button 
                onClick={() => {
                  setSelectedVehicle(null);
                  setShowHistory(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 shadow-inner flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KHI_GRID_COORDS</p>
                  <p className="font-mono text-xs font-black text-slate-800 truncate">
                    {selectedVehicle.lastLocation.lat.toFixed(5)}N, {selectedVehicle.lastLocation.lng.toFixed(5)}E
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl text-slate-500 shadow-inner flex items-center justify-center flex-shrink-0">
                  <Info size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator_ID</p>
                  <p className="font-black text-sm text-slate-900 truncate">{selectedVehicle.driverName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  showHistory ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-950 text-white hover:bg-black'
                }`}
              >
                <History size={16} /> {showHistory ? 'Hiding' : 'History'}
              </button>
              <button 
                onClick={handleSyncClick}
                disabled={isSyncing}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'Syncing' : 'Sync'}
              </button>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 flex gap-8 shadow-2xl max-w-[90vw] whitespace-nowrap overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Active</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]"></div> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Idle</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"></div> 
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;

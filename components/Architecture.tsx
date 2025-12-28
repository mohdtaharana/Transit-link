import React, { useEffect } from 'react';
import { Network, Database, Layers, Cloud, Zap } from 'lucide-react';

const Architecture: React.FC = () => {
  useEffect(() => {
    // Initialize mermaid when component mounts
    // @ts-ignore
    if (window.mermaid) {
      // @ts-ignore
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
      });
      // @ts-ignore
      window.mermaid.contentLoaded();
    }
  }, []);

  const diagram = `
graph TD
    subgraph "Distributed Environment (Karachi)"
        Sensors[Vehicle GPS Sensors]
        Mobile[Dispatcher Mobile App]
    end

    subgraph "Hybrid Data Layer"
        C{Is Backend Online?}
        DB[(MongoDB Cluster)]
        LS[(Local Storage Fallback)]
    end

    subgraph "Business Logic Engine"
        UI[React Functional Components]
        Logic[Alert Logic Engine]
        API[Express/Node.js REST API]
    end

    Sensors --> API
    Mobile --> UI
    
    UI --> Logic
    Logic --> |Alerts| UI
    
    UI --> C
    C -->|Yes| API
    API --> DB
    DB --> API
    API --> UI
    
    C -->|No| LS
    LS --> UI

    classDef terminal fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef cloud fill:#1e293b,stroke:#22c55e,stroke-width:2px,color:#fff;
    classDef fallback fill:#451a03,stroke:#f59e0b,stroke-width:2px,color:#fff;
    
    class UI,Logic terminal;
    class DB,API cloud;
    class LS fallback;
  `;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Architecture</h2>
        <p className="text-sm text-slate-500 font-medium italic">High-level flow diagram for Node Sync & GPS Telemetry</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-slate-950 p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/10 blur-3xl"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="bg-blue-600/20 p-2.5 rounded-2xl text-blue-400">
                   <Layers size={20} />
                 </div>
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Live Flowchart Visualization</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
              </div>
            </div>

            <div className="mermaid flex justify-center py-10 opacity-90 hover:opacity-100 transition-opacity">
              {diagram}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-900 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                 <span className="text-[9px] font-black text-white/70 uppercase">UI Logic</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="text-[9px] font-black text-white/70 uppercase">Cloud Cluster</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <span className="text-[9px] font-black text-white/70 uppercase">Offline Fallback</span>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={18} className="text-blue-600" />
              <h4 className="font-black text-sm uppercase tracking-tight">Key Flow: Sync</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Every telemetry packet first attempts to reach the <span className="text-blue-600 font-bold">Express Engine</span>. If the TCP link is severed, the <span className="text-amber-600 font-bold">LocalStorage Controller</span> takes over state management automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Database size={18} className="text-emerald-600" />
              <h4 className="font-black text-sm uppercase tracking-tight">Data Integrity</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Mongoose schemas enforce strict typing for Karachi nodes, ensuring registration numbers (KHI-XXXX) follow standardized grid protocols before storage.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl">
             <div className="flex items-center gap-2 mb-3">
               <Cloud size={16} className="text-white" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest">Stack Manifest</span>
             </div>
             <div className="space-y-2">
                {['MongoDB 7.0', 'Express 5.2', 'React 19.2', 'Node.js 20'].map(tech => (
                  <div key={tech} className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{tech}</span>
                    <span className="text-emerald-500">LATEST</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Architecture;
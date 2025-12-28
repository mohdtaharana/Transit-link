
import React, { useState } from 'react';
import { Vehicle, VehicleType } from '../types';
import { Plus, Edit2, Trash2, Search, Filter, X, MoreVertical } from 'lucide-react';
import { KARACHI_BOUNDS } from '../constants';

interface FleetManagementProps {
  vehicles: Vehicle[];
  onAdd: (v: Vehicle) => void;
  onUpdate: (v: Vehicle) => void;
  onDelete: (id: string) => void;
}

const FleetManagement: React.FC<FleetManagementProps> = ({ vehicles, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    type: 'Truck',
    status: 'Active',
    capacity: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingVehicle) {
        onUpdate({ ...editingVehicle, ...formData } as Vehicle);
      } else {
        onAdd({
          ...formData,
          id: `v-${Date.now()}`,
          lastLocation: { 
            lat: KARACHI_BOUNDS.center[0], 
            lng: KARACHI_BOUNDS.center[1], 
            timestamp: Date.now() 
          },
          history: [{ 
            lat: KARACHI_BOUNDS.center[0], 
            lng: KARACHI_BOUNDS.center[1], 
            timestamp: Date.now() 
          }]
        } as Vehicle);
      }
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setFormData({ type: 'Truck', status: 'Active', capacity: 0 });
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData(v);
    setIsModalOpen(true);
  };

  const filtered = vehicles.filter(v => 
    v.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fleet Asset Register</h2>
          <p className="text-sm text-slate-500 font-medium">Monitoring {vehicles.length} distributed Karachi nodes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
        >
          <Plus size={18} /> Register Unit
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search registration or driver name..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Responsive Table for Desktop/Tablet */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                <th className="px-8 py-6">Registration</th>
                <th className="px-8 py-6">Classification</th>
                <th className="px-8 py-6">Operator</th>
                <th className="px-8 py-6">Telemetry</th>
                <th className="px-8 py-6">Capacity</th>
                <th className="px-8 py-6 text-right">Commands</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-900 text-sm tracking-tight">{v.regNumber}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-500 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">{v.type}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{v.driverName}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        v.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                        v.status === 'Idle' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{v.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{v.capacity} Units</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => openEdit(v)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-blue-100 rounded-xl shadow-sm transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(v.id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-red-100 rounded-xl shadow-sm transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card View for Mobile/Small Tablets */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
          {filtered.map(v => (
            <div key={v.id} className="bg-white p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-900 text-lg tracking-tighter leading-none">{v.regNumber}</h4>
                    <span className={`w-2 h-2 rounded-full ${v.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{v.type} Node</p>
                </div>
                <div className="flex gap-1">
                   <button onClick={() => openEdit(v)} className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit2 size={16}/></button>
                   <button onClick={() => onDelete(v.id)} className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Operator</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{v.driverName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-xs font-bold text-slate-800">{v.capacity} Units</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${
                    v.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-[9px] font-mono font-bold text-slate-400">Node ID: {v.id}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="inline-flex p-6 bg-slate-50 rounded-[2rem] text-slate-300">
              <Search size={48} />
            </div>
            <div>
              <p className="font-black text-slate-900">No assets found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or node ID</p>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 border border-white/20">
            <form onSubmit={handleSubmit}>
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{editingVehicle ? 'Update Asset' : 'Register Asset'}</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2">Node Configuration Protocol</p>
                </div>
                <button type="button" onClick={closeModal} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Registration Number</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] p-4 text-sm font-bold focus:border-blue-500/50 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="e.g. KHI-0000"
                    value={formData.regNumber || ''}
                    onChange={e => setFormData({...formData, regNumber: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Class</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] p-4 text-sm font-bold focus:border-blue-500/50 focus:bg-white outline-none transition-all appearance-none shadow-inner cursor-pointer"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as VehicleType})}
                      >
                        <option>Truck</option>
                        <option>Bus</option>
                        <option>Rickshaw</option>
                        <option>Van</option>
                      </select>
                      <MoreVertical className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] p-4 text-sm font-bold focus:border-blue-500/50 focus:bg-white outline-none transition-all appearance-none shadow-inner cursor-pointer"
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value as any})}
                      >
                        <option>Active</option>
                        <option>Idle</option>
                        <option>Maintenance</option>
                      </select>
                      <MoreVertical className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operator Assignment</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] p-4 text-sm font-bold focus:border-blue-500/50 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="Full Identification Name"
                    value={formData.driverName || ''}
                    onChange={e => setFormData({...formData, driverName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo Capacity (Units)</label>
                  <input 
                    type="number"
                    required
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] p-4 text-sm font-bold focus:border-blue-500/50 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="0"
                    value={formData.capacity || ''}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                >Abort Process</button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                >{isSaving ? 'Processing...' : 'Execute Command'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;

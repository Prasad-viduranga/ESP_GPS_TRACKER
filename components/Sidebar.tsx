
import React from 'react';
import { TrackingStats, AppMode, MapConfig } from '../types';
import { formatDistance, formatDuration } from '../utils/geoUtils';

interface SidebarProps {
  stats: TrackingStats;
  mode: AppMode;
  config: MapConfig;
  onConfigChange: (newConfig: Partial<MapConfig>) => void;
  onModeChange: (mode: AppMode) => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ stats, mode, config, onConfigChange, onModeChange, onClear }) => {
  return (
    <div className="w-full md:w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-200 overflow-y-auto custom-scrollbar">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          GeoStream Dash
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">ESP32 GPS Telemetry</p>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* Connection Status */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Device Status</label>
          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <span className="text-sm">ESP32 Module</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${mode === AppMode.LIVE ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}>
              {mode === AppMode.LIVE ? 'CONNECTED' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Stats</label>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Distance" value={formatDistance(stats.totalDistance)} color="blue" />
            <StatCard label="Duration" value={formatDuration(stats.duration)} color="purple" />
            <StatCard label="Avg Speed" value={`${stats.avgSpeed.toFixed(1)} km/h`} color="amber" />
            <StatCard label="Current" value={`${stats.currentSpeed.toFixed(1)} km/h`} color="emerald" />
          </div>
        </div>

        {/* Map Controls */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Map Configuration</label>
          
          <div className="flex items-center justify-between p-2">
            <span className="text-sm font-medium">Auto-Center</span>
            <button 
              onClick={() => onConfigChange({ autoCenter: !config.autoCenter })}
              className={`w-10 h-5 rounded-full relative transition-colors ${config.autoCenter ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.autoCenter ? 'left-5.5 transform translate-x-5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-2">
            <span className="text-sm font-medium">Render Path</span>
            <button 
              onClick={() => onConfigChange({ showPath: !config.showPath })}
              className={`w-10 h-5 rounded-full relative transition-colors ${config.showPath ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${config.showPath ? 'left-5.5 transform translate-x-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-800 space-y-3 bg-slate-900/80 sticky bottom-0">
        <div className="grid grid-cols-2 gap-3">
           <button 
            onClick={() => onModeChange(mode === AppMode.LIVE ? AppMode.IDLE : AppMode.LIVE)}
            className={`py-2 px-4 rounded-lg font-bold text-sm transition-all ${mode === AppMode.LIVE ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20'}`}
          >
            {mode === AppMode.LIVE ? 'Stop' : 'Start Live'}
          </button>
          <button 
            onClick={() => onModeChange(mode === AppMode.REPLAY ? AppMode.LIVE : AppMode.REPLAY)}
            disabled={stats.totalDistance === 0}
            className={`py-2 px-4 rounded-lg font-bold text-sm transition-all border border-slate-700 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {mode === AppMode.REPLAY ? 'Live View' : 'Replay'}
          </button>
        </div>
        <button 
          onClick={onClear}
          className="w-full py-2 text-slate-500 text-xs font-semibold hover:text-slate-300 transition-colors"
        >
          CLEAR SESSION DATA
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  };
  
  return (
    <div className={`p-3 rounded-xl border ${colorMap[color]} transition-all hover:scale-[1.02]`}>
      <div className="text-[10px] uppercase font-bold opacity-60 truncate">{label}</div>
      <div className="text-lg font-bold mt-0.5 truncate">{value}</div>
    </div>
  );
};

export default Sidebar;

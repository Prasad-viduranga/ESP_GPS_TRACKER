
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MapDisplay from './components/MapDisplay';
import PlaybackSlider from './components/PlaybackSlider';
import { GPSPoint, AppMode, MapConfig, TrackingStats } from './types';
import { gpsStream } from './services/gpsService';
import { calculateRouteStats } from './utils/geoUtils';

const App: React.FC = () => {
  const [route, setRoute] = useState<GPSPoint[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.IDLE);
  const [config, setConfig] = useState<MapConfig>({
    autoCenter: true,
    showPath: true,
    zoom: 15
  });
  const [replayIndex, setReplayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackIntervalRef = useRef<any>(null);

  const stats: TrackingStats = calculateRouteStats(mode === AppMode.REPLAY ? route.slice(0, replayIndex + 1) : route);

  // Handle incoming GPS data
  const handleGPSData = useCallback((point: GPSPoint) => {
    setRoute(prev => {
      // Check for duplicates or minimal movement if needed
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        // In real ESP32 scenario, the device handles the 10m check. 
        // We just append here.
        if (last.timestamp === point.timestamp) return prev;
      }
      return [...prev, point];
    });
  }, []);

  useEffect(() => {
    if (mode === AppMode.LIVE) {
      gpsStream.connect(handleGPSData);
    } else {
      gpsStream.disconnect();
    }
    return () => gpsStream.disconnect();
  }, [mode, handleGPSData]);

  // Replay logic
  useEffect(() => {
    if (isPlaying && mode === AppMode.REPLAY) {
      playbackIntervalRef.current = setInterval(() => {
        setReplayIndex(prev => {
          if (prev >= route.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 300); // 300ms per point in replay
    } else {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying, mode, route.length]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === AppMode.REPLAY) {
      setReplayIndex(0);
      setIsPlaying(false);
    }
  };

  const clearData = () => {
    if (window.confirm("Are you sure you want to clear the current route data?")) {
      setRoute([]);
      setMode(AppMode.IDLE);
      setReplayIndex(0);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950">
      {/* Mobile-friendly Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          stats={stats} 
          mode={mode} 
          config={config} 
          onConfigChange={(c) => setConfig(prev => ({ ...prev, ...c }))}
          onModeChange={handleModeChange}
          onClear={clearData}
        />
      </div>

      <div className="flex-1 relative flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center z-[1001]">
          <h1 className="text-white font-bold text-sm">GeoStream Dash</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => handleModeChange(mode === AppMode.LIVE ? AppMode.IDLE : AppMode.LIVE)}
              className={`px-3 py-1 rounded text-xs font-bold ${mode === AppMode.LIVE ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}
            >
              {mode === AppMode.LIVE ? 'STOP' : 'LIVE'}
            </button>
          </div>
        </div>

        <main className="flex-1 relative">
          <MapDisplay 
            route={mode === AppMode.REPLAY ? route.slice(0, replayIndex + 1) : route}
            autoCenter={config.autoCenter}
            activePoint={mode === AppMode.REPLAY ? route[replayIndex] : null}
          />
          
          {/* Overlay Info Card */}
          <div className="absolute top-6 left-6 z-[1000] hidden lg:block">
             <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl shadow-xl flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Live Heading</span>
                  <span className="text-xl font-black text-white">{stats.currentSpeed.toFixed(1)} <span className="text-xs font-normal text-slate-400">km/h</span></span>
                </div>
                <div className="w-[1px] h-10 bg-slate-700" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Progress</span>
                  <span className="text-xl font-black text-white">{ (stats.totalDistance / 1000).toFixed(2) } <span className="text-xs font-normal text-slate-400">km</span></span>
                </div>
             </div>
          </div>

          {mode === AppMode.REPLAY && (
            <PlaybackSlider 
              route={route} 
              currentIndex={replayIndex} 
              onIndexChange={setReplayIndex}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;


import React from 'react';
import { GPSPoint } from '../types';

interface PlaybackSliderProps {
  route: GPSPoint[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const PlaybackSlider: React.FC<PlaybackSliderProps> = ({ route, currentIndex, onIndexChange, isPlaying, onTogglePlay }) => {
  if (route.length === 0) return null;

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={onTogglePlay}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="flex-1 space-y-1">
          <input 
            type="range" 
            min="0" 
            max={route.length - 1} 
            value={currentIndex} 
            onChange={(e) => onIndexChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>{new Date(route[0].timestamp).toLocaleTimeString()}</span>
            <span>{currentIndex + 1} / {route.length} points</span>
            <span>{new Date(route[route.length - 1].timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackSlider;

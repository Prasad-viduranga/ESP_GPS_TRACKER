
export interface GPSPoint {
  lat: number;
  lng: number;
  timestamp: number;
  speed: number; // in km/h
}

export interface TrackingStats {
  totalDistance: number; // in meters
  duration: number; // in seconds
  avgSpeed: number; // in km/h
  currentSpeed: number; // in km/h
}

export enum AppMode {
  LIVE = 'LIVE',
  REPLAY = 'REPLAY',
  IDLE = 'IDLE'
}

export interface MapConfig {
  autoCenter: boolean;
  showPath: boolean;
  zoom: number;
}


import { GPSPoint } from '../types';

/**
 * Calculates the distance between two coordinates using the Haversine formula
 */
export const calculateDistance = (p1: { lat: number, lng: number }, p2: { lat: number, lng: number }): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)}km`;
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
};

export const calculateRouteStats = (route: GPSPoint[]) => {
  if (route.length < 2) {
    return {
      totalDistance: 0,
      duration: 0,
      avgSpeed: 0,
      currentSpeed: 0
    };
  }

  let totalDist = 0;
  for (let i = 1; i < route.length; i++) {
    totalDist += calculateDistance(route[i - 1], route[i]);
  }

  const startTime = route[0].timestamp;
  const endTime = route[route.length - 1].timestamp;
  const durationInSeconds = (endTime - startTime) / 1000;
  
  const avgSpeed = durationInSeconds > 0 
    ? (totalDist / 1000) / (durationInSeconds / 3600) 
    : 0;

  return {
    totalDistance: totalDist,
    duration: durationInSeconds,
    avgSpeed: avgSpeed,
    currentSpeed: route[route.length - 1].speed
  };
};

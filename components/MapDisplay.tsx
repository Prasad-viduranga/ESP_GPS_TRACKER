
import React, { useEffect, useRef } from 'react';
import { GPSPoint } from '../types';

declare const L: any;

interface MapDisplayProps {
  route: GPSPoint[];
  autoCenter: boolean;
  activePoint?: GPSPoint | null;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ route, autoCenter, activePoint }) => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const polylineRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Map
    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
    }).setView([37.7749, -122.4194], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    polylineRef.current = L.polyline([], {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.8,
      smoothFactor: 1.5
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Update Route Polyline
  useEffect(() => {
    if (!mapRef.current || route.length === 0) return;

    const latLngs = route.map(p => [p.lat, p.lng]);
    polylineRef.current.setLatLngs(latLngs);

    // Manage Markers
    const startPoint = route[0];
    const latestPoint = activePoint || route[route.length - 1];

    // Start Marker
    if (!startMarkerRef.current) {
      startMarkerRef.current = L.circleMarker([startPoint.lat, startPoint.lng], {
        radius: 8,
        fillColor: "#10b981",
        color: "#fff",
        weight: 2,
        fillOpacity: 1
      }).addTo(mapRef.current).bindPopup("Start Point");
    }

    // Current/Active Marker
    if (!currentMarkerRef.current) {
      currentMarkerRef.current = L.circleMarker([latestPoint.lat, latestPoint.lng], {
        radius: 10,
        fillColor: "#3b82f6",
        color: "#fff",
        weight: 3,
        fillOpacity: 1
      }).addTo(mapRef.current);
    } else {
      currentMarkerRef.current.setLatLng([latestPoint.lat, latestPoint.lng]);
    }

    // Auto-center logic
    if (autoCenter) {
      mapRef.current.panTo([latestPoint.lat, latestPoint.lng], { animate: true });
    }
  }, [route, autoCenter, activePoint]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default React.memo(MapDisplay);

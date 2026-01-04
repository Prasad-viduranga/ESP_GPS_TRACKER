
import { GPSPoint } from '../types';

/**
 * Simulates a WebSocket connection to an ESP32 device.
 * In a real app, you would use: new WebSocket('ws://esp32-ip:port')
 */
export class ESP32GPSStream {
  private socket: any = null;
  private onDataCallback: ((point: GPSPoint) => void) | null = null;
  private isRunning = false;
  private interval: any = null;

  // Mock path: San Francisco area
  private mockPath: [number, number][] = [
    [37.7749, -122.4194],
    [37.7750, -122.4196],
    [37.7752, -122.4200],
    [37.7755, -122.4205],
    [37.7758, -122.4210],
    [37.7762, -122.4216],
    [37.7765, -122.4222],
    [37.7768, -122.4228],
    [37.7772, -122.4235],
    [37.7776, -122.4242],
    [37.7780, -122.4248],
    [37.7785, -122.4255],
    [37.7790, -122.4262],
    [37.7800, -122.4275],
    [37.7810, -122.4290],
    [37.7820, -122.4305],
    [37.7830, -122.4320],
  ];
  private pathIndex = 0;

  constructor() {}

  public connect(callback: (point: GPSPoint) => void) {
    this.onDataCallback = callback;
    this.isRunning = true;
    this.simulateStream();
    console.log("Mock ESP32 Stream Connected");
  }

  public disconnect() {
    this.isRunning = false;
    if (this.interval) clearInterval(this.interval);
    console.log("Mock ESP32 Stream Disconnected");
  }

  private simulateStream() {
    this.interval = setInterval(() => {
      if (!this.isRunning || !this.onDataCallback) return;

      const baseCoord = this.mockPath[this.pathIndex % this.mockPath.length];
      // Add slight jitter for realism
      const jitter = (Math.random() - 0.5) * 0.0001;
      
      const point: GPSPoint = {
        lat: baseCoord[0] + jitter,
        lng: baseCoord[1] + jitter,
        timestamp: Date.now(),
        speed: 15 + Math.random() * 10
      };

      this.onDataCallback(point);
      this.pathIndex++;
    }, 2000); // Simulate movement update every 2s
  }
}

export const gpsStream = new ESP32GPSStream();

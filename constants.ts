import { Vehicle } from './types';

export const KARACHI_BOUNDS = {
  center: [24.9107, 67.09] as [number, number],
  zoom: 12
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "v3",
    regNumber: "KHI-5544",
    type: "Van",
    driverName: "Zarrar Tariq",
    status: "Active",
    lastLocation: { lat: 24.9431, lng: 67.1255, timestamp: Date.now() },
    history: [{ lat: 24.9431, lng: 67.1255, timestamp: Date.now() }],
    capacity: 15
  },
  {
    id: "v4",
    regNumber: "KHI-1122",
    type: "Truck",
    driverName: "hamza",
    status: "Active",
    lastLocation: { lat: 24.9702, lng: 67.1398, timestamp: Date.now() },
    history: [{ lat: 24.9702, lng: 67.1398, timestamp: Date.now() }],
    capacity: 8000
  },
  {
    id: "v5",
    regNumber: "KHI-3388",
    type: "Rickshaw",
    driverName: "kashif khoso",
    status: "Active",
    lastLocation: { lat: 24.9555, lng: 67.1620, timestamp: Date.now() },
    history: [{ lat: 24.9555, lng: 67.1620, timestamp: Date.now() }],
    capacity: 3
  },
  {
    id: "v6",
    regNumber: "KHI-0041",
    type: "Van",
    driverName: "DR fida hussain khoso",
    status: "Maintenance",
    lastLocation: { lat: 24.8615, lng: 67.0099, timestamp: Date.now() },
    history: [{ lat: 24.8615, lng: 67.0099, timestamp: Date.now() }],
    capacity: 12
  },
  {
    id: "v-1766952444139",
    regNumber: "KHI-063",
    type: "Truck",
    driverName: "SAAD AZIZ",
    status: "Maintenance",
    lastLocation: { lat: 24.9107, lng: 67.1156, timestamp: Date.now() },
    history: [{ lat: 24.9107, lng: 67.1156, timestamp: Date.now() }],
    capacity: 2
  }
];

export const APP_THEME = {
  primary: '#0f172a',
  secondary: '#334155',
  accent: '#3b82f6',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b'
};
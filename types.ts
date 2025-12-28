
export type VehicleType = 'Truck' | 'Bus' | 'Rickshaw' | 'Van';

export interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface Vehicle {
  id: string;
  regNumber: string;
  type: VehicleType;
  driverName: string;
  status: 'Active' | 'Idle' | 'Maintenance';
  lastLocation: Location;
  history: Location[];
  capacity: number;
}

export interface TrackingData {
  vehicleId: string;
  lat: number;
  lng: number;
  speed: number;
  battery: number;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Dispatcher' | 'Driver';
  token?: string;
}

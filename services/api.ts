
import { Vehicle } from '../types';

// Using explicit 127.0.0.1 to avoid IPv6 resolution issues common in Node.js on Windows
const BASE_URL = 'http://127.0.0.1:3001/api';

/**
 * Proper Full-Stack API Service
 * Interacts directly with Node.js/Express Backend
 */
export const api = {
  // READ: Fetch all vehicle data from MongoDB
  getVehicles: async (): Promise<Vehicle[]> => {
    try {
      const response = await fetch(`${BASE_URL}/vehicles`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`DB_FETCH_ERROR: ${response.statusText}`);
      }
      return await response.json();
    } catch (e: any) {
      console.error('API_GET_VEHICLES_FAILED:', e);
      throw e;
    }
  },

  // CREATE: Save new vehicle to MongoDB
  addVehicle: async (vehicle: Vehicle): Promise<Vehicle> => {
    const response = await fetch(`${BASE_URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'REGISTRATION_ERROR');
    }
    return await response.json();
  },

  // UPDATE: Sync modifications to MongoDB
  updateVehicle: async (vehicle: Vehicle): Promise<Vehicle> => {
    const response = await fetch(`${BASE_URL}/vehicles/${vehicle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) {
      throw new Error(`SYNC_ERROR: ${response.statusText}`);
    }
    return await response.json();
  },

  // DELETE: Remove record from MongoDB
  deleteVehicle: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`DECOMMISSION_ERROR: ${response.statusText}`);
    }
  }
};

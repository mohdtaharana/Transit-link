
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection Configuration
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/transitlink';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ DATABASE_LINK_ESTABLISHED :: Karachi_Cluster_Connected'))
  .catch(err => {
    console.error('❌ DATABASE_LINK_FAILED ::', err.message);
    console.info('Ensure MongoDB is running locally: mongod');
  });

// Database Schema
const vehicleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  regNumber: { type: String, required: true },
  type: { type: String, enum: ['Truck', 'Bus', 'Rickshaw', 'Van'], default: 'Truck' },
  driverName: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Idle', 'Maintenance'], default: 'Active' },
  lastLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Number, default: Date.now }
  },
  history: [{
    lat: Number,
    lng: Number,
    timestamp: Number
  }],
  capacity: { type: Number, default: 0 }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

/**
 * RESTful CRUD Endpoints
 */

app.get('/api/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ _id: -1 }).lean();
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'FAILED_TO_FETCH_REGISTRY', message: err.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ error: 'REGISTRATION_DENIED', message: err.message });
  }
});

app.put('/api/vehicles/:id', async (req, res) => {
  try {
    const updated = await Vehicle.findOneAndUpdate(
      { id: req.params.id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'NODE_NOT_FOUND' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'UPDATE_REJECTED', message: err.message });
  }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const result = await Vehicle.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: 'NODE_NOT_FOUND' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'DECOMMISSION_FAILED', message: err.message });
  }
});

// Server Initialization - Binding to 0.0.0.0 for maximum compatibility
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 COMMAND_CENTER_ONLINE :: http://127.0.0.1:${PORT}`);
  console.log(`📡 API_READY :: /api/vehicles`);
});

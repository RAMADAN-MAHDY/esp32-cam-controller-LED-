import mongoose from 'mongoose';

const deviceStateSchema = new mongoose.Schema({
  led: { type: String, enum: ['on', 'off'], default: 'off' },
  camera: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('DeviceState', deviceStateSchema);

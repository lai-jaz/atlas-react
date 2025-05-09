import mongoose from "mongoose";

const roammateSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Ensure unique connections between users
roammateSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("Roammate", roammateSchema);
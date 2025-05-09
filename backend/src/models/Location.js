import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // e.g., "Eiffel Tower"
  description: { type: String },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  visitDate: { type: String }, // Added: Store the date the user visited this location
  color: { type: String, default: '#2A9D8F' }, // Added: Store pin color preference
  datePinned: { type: Date, default: Date.now },
});

export default mongoose.model("Location", locationSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    avatar: { type: String, default: "/placeholder.svg" },
    bio: { type: String },
    location: { type: String },
    interests: [{ type: String }],
    joinedDate: { type: Date, default: Date.now },
    // Add these fields for tracking stats
    locationsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

export default mongoose.model('User', userSchema);

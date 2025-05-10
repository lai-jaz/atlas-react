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
    interests: { type: String },
    joinedDate: { type: Date, default: Date.now },

    locationsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

userSchema.pre("save", async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);

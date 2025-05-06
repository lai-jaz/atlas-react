import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  username: { type: String },
  avatar: { type: String },
  bio: { type: String },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  travelInterests: [{ type: String }],
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

export default mongoose.model('User', userSchema);
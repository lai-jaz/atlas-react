import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  type: {
    type: String,
    enum: ['follow', 'follower'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import FriendRequest from "../models/FriendRequest.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// // Authentication middleware
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "Missing token" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const { id } = jwt.verify(token, JWT_SECRET);
//     req.userId = id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };

// Get all users (for discovery)
router.get("/all", authenticate, async (req, res) => {
  try {
    const currentUserId = req.userId;
    
    // Find all users except the current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password")
      .limit(20);
    
    // Get all connections involving the current user
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ]
    });
    
    // Map users with their connection status relative to current user
    const usersWithStatus = users.map(user => {
      const userObj = user.toObject();
      
      // Find if there's a connection between current user and this user
      const connection = connections.find(conn => 
        (conn.requester.toString() === currentUserId && conn.recipient.toString() === user._id.toString()) ||
        (conn.recipient.toString() === currentUserId && conn.requester.toString() === user._id.toString())
      );

      if (connection) {
        if (connection.status === 'accepted') {
          userObj.connectionStatus = 'accepted';
        } else if (connection.status === 'pending') {
          if (connection.requester.toString() === currentUserId) {
            userObj.connectionStatus = 'pending';
          } else {
            userObj.connectionStatus = 'incoming';
          }
        }
      } else {
        userObj.connectionStatus = null;
      }

      return userObj;
    });

    res.json(usersWithStatus);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Search for users
router.get("/search", authenticate, async (req, res) => {
  try {
    const { query, searchType } = req.query;
    const currentUserId = req.userId;

    let searchQuery = { _id: { $ne: currentUserId } }; // Exclude current user

    // Build search query based on searchType
    if (query && query.trim()) {
      if (searchType === 'location') {
        // Search by location
        searchQuery["profile.location"] = { $regex: query, $options: "i" };
      } else if (searchType === 'interest') {
        // Search by interest
        searchQuery["profile.interests"] = { $regex: query, $options: "i" };
      } else {
        // Default: search by name, username, email, location, or interests
        searchQuery.$and = [
          { _id: { $ne: currentUserId } },
          {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { username: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } },
              { "profile.location": { $regex: query, $options: "i" } },
              { "profile.interests": { $regex: query, $options: "i" } }
            ]
          }
        ];
      }
    }

    // Find users that match the query
    const users = await User.find(searchQuery).select("-password");

    // Get all connections involving the current user
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ]
    });

    // Map users with their connection status relative to current user
    const usersWithStatus = users.map(user => {
      const userObj = user.toObject();
      
      // Find if there's a connection between current user and this user
      const connection = connections.find(conn => 
        (conn.requester.toString() === currentUserId && conn.recipient.toString() === user._id.toString()) ||
        (conn.recipient.toString() === currentUserId && conn.requester.toString() === user._id.toString())
      );

      if (connection) {
        if (connection.status === 'accepted') {
          userObj.connectionStatus = 'accepted';
        } else if (connection.status === 'pending') {
          if (connection.requester.toString() === currentUserId) {
            userObj.connectionStatus = 'pending';
          } else {
            userObj.connectionStatus = 'incoming';
          }
        }
      } else {
        userObj.connectionStatus = null;
      }

      return userObj;
    });

    res.json(usersWithStatus);
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ error: "Failed to search users" });
  }
});

// Get connected roammates
router.get("/connected", authenticate, async (req, res) => {
  try {
    const currentUserId = req.userId;
    
    // Find all accepted connections where the current user is involved
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId, status: 'accepted' },
        { recipient: currentUserId, status: 'accepted' }
      ]
    });
    
    // Extract the IDs of connected users and map them to their connection IDs
    const connectedUserMap = connections.reduce((map, conn) => {
      const otherUserId = conn.requester.toString() === currentUserId ? 
        conn.recipient : conn.requester;
      map[otherUserId] = conn._id;
      return map;
    }, {});
    
    const connectedUserIds = Object.keys(connectedUserMap);
    
    // Fetch the user details for connected users
    const connectedUsers = await User.find({
      _id: { $in: connectedUserIds }
    }).select("-password");
    
    // Add connectionStatus and connectionId to each user
    const usersWithStatus = connectedUsers.map(user => {
      const userObj = user.toObject();
      userObj.connectionStatus = 'accepted';
      userObj.connectionId = connectedUserMap[user._id.toString()];
      return userObj;
    });
    
    res.json(usersWithStatus);
  } catch (err) {
    console.error("Error fetching connected users:", err);
    res.status(500).json({ error: "Failed to fetch connected users" });
  }
});

// Get pending connection requests
router.get("/pending", authenticate, async (req, res) => {
  try {
    const currentUserId = req.userId;
    
    // Find all pending connection requests where the current user is the recipient
    const pendingRequests = await Connection.find({
      recipient: currentUserId,
      status: 'pending'
    }).populate('requester', '-password');
    
    res.json(pendingRequests);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
});

// Send connection request
router.post("/request", authenticate, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.userId;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient user not found" });
    }

    // Check if a connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ 
        error: "Connection already exists", 
        status: existingConnection.status 
      });
    }

    // Create new connection request
    const newConnection = new Connection({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    await newConnection.save();
    res.status(201).json({ message: "Connection request sent" });
  } catch (err) {
    console.error("Error sending connection request:", err);
    res.status(500).json({ error: "Failed to send connection request" });
  }
});

// Respond to connection request
router.put("/respond", authenticate, async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const currentUserId = req.userId;

    // Find the connection request
    const connectionRequest = await Connection.findById(requestId);
    
    if (!connectionRequest) {
      return res.status(404).json({ error: "Connection request not found" });
    }

    // Verify the current user is the recipient
    if (connectionRequest.recipient.toString() !== currentUserId) {
      return res.status(403).json({ error: "Not authorized to respond to this request" });
    }

    if (action === 'accepted') {
      connectionRequest.status = 'accepted';
      await connectionRequest.save();
      
      // Update follower/following counts
      const requesterId = connectionRequest.requester;
      const recipientId = connectionRequest.recipient;
      
      // When A sends request to B and B accepts:
      // A is following B, so A's following count increases
      // B is followed by A, so B's followers count increases
      await User.findByIdAndUpdate(requesterId, {
        $inc: { "profile.followingCount": 1 }
      });
      
      await User.findByIdAndUpdate(recipientId, {
        $inc: { "profile.followersCount": 1 }
      });
      
      // Create a FriendRequest record to track the relationship
      const friendRequest = new FriendRequest({
        requester: requesterId,
        recipient: recipientId,
        status: 'accepted',
        type: 'follow' // The requester is following the recipient
      });
      
      await friendRequest.save();
      
      res.json({ message: "Connection accepted" });
    } else if (action === 'rejected') {
      await Connection.findByIdAndDelete(requestId);
      res.json({ message: "Connection rejected" });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (err) {
    console.error("Error responding to connection request:", err);
    res.status(500).json({ error: "Failed to respond to connection request" });
  }
});

// Get roammate suggestions
router.get("/suggestions", authenticate, async (req, res) => {
  try {
    const currentUserId = req.userId;
    
    // Get current user's profile to find matching interests
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Get all connections to exclude already connected users
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ]
    });
    
    // Extract IDs of users that are already connected or have pending requests
    const connectedUserIds = connections.map(conn => {
      return conn.requester.toString() === currentUserId ? 
        conn.recipient.toString() : conn.requester.toString();
    });
    
    // Add current user ID to excluded list
    connectedUserIds.push(currentUserId);
    
    // Find users with similar interests or location
    const userInterests = currentUser.profile?.interests || [];
    const userLocation = currentUser.profile?.location || "";
    
    let matchQuery = { _id: { $nin: connectedUserIds } };
    
    // If user has interests, find users with matching interests
    if (userInterests.length > 0) {
      matchQuery.$or = [
        { "profile.interests": { $in: userInterests } }
      ];
      
      // If user has location, add it as another matching criteria
      if (userLocation) {
        matchQuery.$or.push({ "profile.location": { $regex: userLocation.split(',')[0], $options: "i" } });
      }
    } else if (userLocation) {
      // If only location is available
      matchQuery["profile.location"] = { $regex: userLocation.split(',')[0], $options: "i" };
    }
    
    // Find matching users
    const suggestedUsers = await User.find(matchQuery)
      .select("-password")
      .limit(10);
    
    // Calculate relevance score for each user
    const usersWithRelevance = suggestedUsers.map(user => {
      const userObj = user.toObject();
      
      // Count common interests
      const commonInterests = userInterests.filter(interest => 
        user.profile?.interests?.includes(interest)
      ).length;
      
      // Check if location matches
      const locationMatch = userLocation && user.profile?.location && 
        user.profile.location.includes(userLocation.split(',')[0]);
      
      // Calculate relevance score (simple version)
      const relevanceScore = commonInterests + (locationMatch ? 3 : 0);
      
      userObj.relevanceScore = relevanceScore;
      userObj.commonInterests = commonInterests;
      userObj.locationMatch = locationMatch;
      userObj.connectionStatus = null;
      
      return userObj;
    });
    
    // Sort by relevance score
    usersWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    res.json(usersWithRelevance);
  } catch (err) {
    console.error("Error fetching roammate suggestions:", err);
    res.status(500).json({ error: "Failed to fetch roammate suggestions" });
  }
});

// Add this route to handle connection removal
router.delete("/connection/:connectionId", authenticate, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const currentUserId = req.userId;
    
    // Find the connection
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }
    
    // Verify the current user is part of this connection
    if (connection.requester.toString() !== currentUserId && 
        connection.recipient.toString() !== currentUserId) {
      return res.status(403).json({ error: "Not authorized to remove this connection" });
    }
    
    // Only proceed if the connection was accepted
    if (connection.status === 'accepted') {
      const requesterId = connection.requester.toString();
      const recipientId = connection.recipient.toString();
      
      // Decrement the appropriate counts based on the connection direction
      // When A follows B and the connection is removed:
      // A's following count decreases
      // B's followers count decreases
      await User.findByIdAndUpdate(requesterId, {
        $inc: { "profile.followingCount": -1 }
      });
      
      await User.findByIdAndUpdate(recipientId, {
        $inc: { "profile.followersCount": -1 }
      });
      
      // Remove any FriendRequest records
      await FriendRequest.deleteMany({
        requester: requesterId,
        recipient: recipientId
      });
    }
    
    // Delete the connection
    await Connection.findByIdAndDelete(connectionId);
    
    res.json({ message: "Connection removed successfully" });
  } catch (err) {
    console.error("Error removing connection:", err);
    res.status(500).json({ error: "Failed to remove connection" });
  }
});

export default router;
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import FriendRequest from "../models/FriendRequest.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    req.userId = id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


router.get("/all", authenticate, async (req, res) => {
  try {
    const currentUserId = req.userId;
    
    // Find all users except the current user
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password")
      .limit(20);
   
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ]
    });
    
   
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

router.get("/search", authenticate, async (req, res) => {
  try {
    const { query, searchType } = req.query;
    const currentUserId = req.userId;

    let searchQuery = { _id: { $ne: currentUserId } }; // Exclude current user

    if (query && query.trim()) {
      if (searchType === 'location') {
     
        searchQuery["profile.location"] = { $regex: query, $options: "i" };
      } else if (searchType === 'interest') {
      
        searchQuery["profile.interests"] = { $regex: query, $options: "i" };
      } else {
       
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

    
    const users = await User.find(searchQuery).select("-password");

    
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ]
    });

   
    const usersWithStatus = users.map(user => {
      const userObj = user.toObject();
      
     
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


router.get("/connected", authenticate, async (req, res) => {
  try {
    const currentUserId = req.userId;
  
    const connections = await Connection.find({
      $or: [
        { requester: currentUserId, status: 'accepted' },
        { recipient: currentUserId, status: 'accepted' }
      ]
    });
    
    const connectedUserMap = connections.reduce((map, conn) => {
      const otherUserId = conn.requester.toString() === currentUserId ? 
        conn.recipient : conn.requester;
      map[otherUserId] = conn._id;
      return map;
    }, {});
    
    const connectedUserIds = Object.keys(connectedUserMap);
    
    
    const connectedUsers = await User.find({
      _id: { $in: connectedUserIds }
    }).select("-password");
    
    
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

router.post("/request", authenticate, async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.userId;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient user not found" });
    }

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

router.put("/respond", authenticate, async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const currentUserId = req.userId;

    const connectionRequest = await Connection.findById(requestId);
    
    if (!connectionRequest) {
      return res.status(404).json({ error: "Connection request not found" });
    }

    if (connectionRequest.recipient.toString() !== currentUserId) {
      return res.status(403).json({ error: "Not authorized to respond to this request" });
    }

    if (action === 'accepted') {
      connectionRequest.status = 'accepted';
      await connectionRequest.save();
      
      // Update follower/following counts
      const requesterId = connectionRequest.requester;
      const recipientId = connectionRequest.recipient;
    
      await User.findByIdAndUpdate(requesterId, {
        $inc: { "profile.followingCount": 1 }
      });
      
      await User.findByIdAndUpdate(recipientId, {
        $inc: { "profile.followersCount": 1 }
      });
 
      const friendRequest = new FriendRequest({
        requester: requesterId,
        recipient: recipientId,
        status: 'accepted',
        type: 'follow' 
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

    const connectedUserIds = connections.map(conn => {
      return conn.requester.toString() === currentUserId ? 
        conn.recipient.toString() : conn.requester.toString();
    });
    
  
    connectedUserIds.push(currentUserId);
    
    const userInterests = currentUser.profile?.interests ? currentUser.profile?.interests.split(',') : [];
    const userLocation = currentUser.profile?.location || "";
    
    let matchQuery = { _id: { $nin: connectedUserIds } };
    
    if (userInterests.length > 0) {
      matchQuery.$or = [
        ...userInterests.map(interest => ({
          "profile.interests": { $regex: new RegExp(`(^|,\\s*)${interest}(,|$)`, 'i')}
        }))

      ];
      
   
      if (userLocation) {
        matchQuery.$or.push({ "profile.location": { $regex: userLocation.split(',')[0], $options: "i" } });
      }
    } else if (userLocation) {
      
      matchQuery["profile.location"] = { $regex: userLocation.split(',')[0], $options: "i" };
    }
    
    const suggestedUsers = await User.find(matchQuery)
      .select("-password")
      .limit(10);
    
    const usersWithRelevance = suggestedUsers.map(user => {
    const userObj = user.toObject();
 
      const otherInterests = user.profile?.interests? user.profile.interests.split(',') : [];

      const commonInterests = userInterests.filter(interest =>
          otherInterests.includes(interest)
        ).length;
   
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
    
  
    usersWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    res.json(usersWithRelevance);
  } catch (err) {
    console.error("Error fetching roammate suggestions:", err);
    res.status(500).json({ error: "Failed to fetch roammate suggestions" });
  }
});

router.delete("/connection/:connectionId", authenticate, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const currentUserId = req.userId;
    
    
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }
    
 
    if (connection.requester.toString() !== currentUserId && 
        connection.recipient.toString() !== currentUserId) {
      return res.status(403).json({ error: "Not authorized to remove this connection" });
    }
    
    
    if (connection.status === 'accepted') {
      const requesterId = connection.requester.toString();
      const recipientId = connection.recipient.toString();
    
      await User.findOneAndUpdate(
        { _id: requesterId, "profile.followingCount": { $gt: 0 } },
        { $inc: { "profile.followingCount": -1 } }
      );

      await User.findOneAndUpdate(
        { _id: recipientId, "profile.followersCount": { $gt: 0 } },
        { $inc: { "profile.followersCount": -1 } }
      );
  
      await FriendRequest.deleteMany({
        requester: requesterId,
        recipient: recipientId
      });
    }
    

    await Connection.findByIdAndDelete(connectionId);
    
    res.json({ message: "Connection removed successfully" });
  } catch (err) {
    console.error("Error removing connection:", err);
    res.status(500).json({ error: "Failed to remove connection" });
  }
});

export default router;

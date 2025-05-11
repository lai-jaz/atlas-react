import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//-------------------------SIGN UP-------------------------//
router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;

    try {  // check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
        }

        // create new user
        // const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ 
            email, 
            password, 
            name });

        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET);
        
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: "User already exists" });
    }
});

//-------------------------LOGIN-------------------------//
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
        // find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
  
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  //-------------------------USER PROFILE-------------------------//
  router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).end();
  
    const token = authHeader.split(" ")[1];
  
    try {
      // veryify token and get id, find user
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id).select("-password");
  
      // user does not exist...
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
  
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Invalid token" });
    }
  });

//----------------------GET USER-------------------------------
router.get('/users/:authorid', async (req, res) => {
  try {
    const { authorid } = req.params;

    const user = await User.findById(authorid).select('name profile.avatar'); // only get name and avatar
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
  
export default router;
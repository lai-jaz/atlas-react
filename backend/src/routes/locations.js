import express from "express";
import jwt from "jsonwebtoken";
import Location from "../models/Location.js";
import User from "../models/User.js";

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


router.get("/", authenticate, async (req, res) => {
  try {
    const locations = await Location.find({ user: req.userId });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/", authenticate, async (req, res) => {
  const { name, description, coordinates } = req.body;
  try {
    const location = await Location.create({
      user: req.userId,
      name,
      description,
      coordinates
    });
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: "Invalid location data" });
  }
});


router.delete("/:id", authenticate, async (req, res) => {
  try {
    const location = await Location.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/:id", authenticate, async (req, res) => {
  const { name, description, coordinates } = req.body;
  try {
    const updated = await Location.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, description, coordinates },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Location not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import express from "express";
import path from 'path';
import multer from "multer";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ---------------file uploads-----------------//
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

//-------------------------Update Profile-------------------------//
router.patch('/update', upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, bio, location, interests } = req.body;
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : "";

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedFields = {
      name,
      profile: {
        bio,
        location,
        interests,
        avatar: avatarPath || existingUser.profile.avatar
      }
    };

    await User.findOneAndUpdate(
      { email},
      { $set: updatedFields },
      { runValidators: true }
    );

    res.json({ success: true }).status(200);
  } 
  catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
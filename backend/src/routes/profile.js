import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//-------------------------Update Profile-------------------------//
router.patch("/profile/update", authenticate, async (req, res) => {
    const updateData = req.body;
    const id = req.user.id;

    try {
        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
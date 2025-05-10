import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//-------------------------Update Profile-------------------------//
router.patch("/update", async (req, res) => {
    const updateData = req.body;
    const email = req.body.email;

    try {
        const user = await User.findOneAndUpdate({email}, {
            $set: updateData, 
        }, {
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

//-------------------------Update Account-------------------------//
// check this, bcrypt not working it's neither comparing nor hashing
router.patch("/account/update", async (req, res) => {
    const { id, email, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({_id : id});

        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        if (email && email !== user.email) {
            user.email = email;
        }

        await user.save();
        res.status(200).json({ message: "Account updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/locations.js";
import tipRoutes from './routes/tips.js';
import roammateRoutes from './routes/roammates.js';
import journalRoutes from "./routes/journalRoutes.js";
import profileRoutes from "./routes/profile.js";
import socialRoutes from "./routes/social.js";

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/locations", locationRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/roammates', roammateRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/social', socialRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

mongoose
.connect(process.env.MONGO_URI)
.then(() => app.listen(3000, () => console.log("Server running")))
.catch(console.error);

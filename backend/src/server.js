import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/locations.js";
import tipRoutes from './routes/tips.js';
import roammateRoutes from './routes/roammates.js';
import journalRoutes form "./routes/journalRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/locations", locationRoutes);
app.use('/api/tips', tipRoutes);
app.use('/api/roammates', roammateRoutes);
app.use('/api/journals', journalRoutes);

mongoose
.connect(process.env.MONGO_URI)
.then(() => app.listen(3000, () => console.log("Server running")))
.catch(console.error);

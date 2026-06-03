import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import billRoutes from "./routes/billRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";

dotenv.config();
const app = express();

app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/diligent';

// Check if database is already connected or connecting to prevent multiple connections in serverless runtime
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// Standard middleware so our backend can accept JSON data sent from the Vite frontend
app.use(express.json());

app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);

app.get('/', (req, res) => {
  res.json({
    status: "active",
    message: "Manikyapriya Agencies backend running smoothly."
  });
});

export default app;

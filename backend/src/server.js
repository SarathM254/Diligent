import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import billRoutes from "./routes/billRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
const app = express(); 

// Use an environment variable for the port, fallback to 3000 if not defined
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/diligent';

mongoose.connect(MONGO_URI)                                               // THIS ENV HANDLING MUSTBE UNDERSTOOD
  .then(() => console.log('✅ Successfully connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Standard middleware so our backend can accept JSON data sent from the Vite frontend
app.use(express.json());

app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);

app.get('/', (req, res) => {
  res.json({ 
    status: "active", 
    message: "Manikyapriya Agencies backend running smoothly." 
  });
});

app.listen(PORT, () => {
  // Check your terminal window right after running the server to see this print!
  console.log(`Distribution engine live on port ${PORT}`);
});
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import posts from './routes/posts.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', posts);

// Connect to MongoDB
mongoose.connect(process.env.VITE_MONG_URI)
  .then(() => {
    app.listen(process.env.VITE_PORT, () => {
      console.log(`Server running on port ${process.env.VITE_PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });
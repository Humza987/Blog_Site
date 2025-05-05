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

const PORT = process.env.PORT || 4000;  

mongoose
  .connect(process.env.VITE_MONG_URI)    
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

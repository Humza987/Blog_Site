import express from 'express';
const app = express()

import mongoose from 'mongoose';
import posts from './routes/posts.js';

import dotenv from 'dotenv';
dotenv.config();

app.use(express.json());

app.use('/api' , posts)

mongoose.connect(process.env.VITE_MONG_URI)
    .then(() => {
        app.listen(process.env.VITE_PORT, () => {console.log("We are running on 5000!!!")})

    })
    .catch((error) => {
        console.log(error)
    })


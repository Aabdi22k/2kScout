// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js'

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
});


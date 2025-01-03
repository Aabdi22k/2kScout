import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/Player.js'; // Ensure you have the Player schema defined

dotenv.config();

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

// Migrate Players from SQLite to MongoDB
async function migratePlayers() {
  // Connect to MongoDB
  await connectToMongoDB();

  // Connect to SQLite
  const db = await open({
    filename: './players.db',
    driver: sqlite3.Database,
  });

  try {
    // Fetch all players from SQLite
    const players = await db.all('SELECT * FROM players');
    console.log(`Fetched ${players.length} players from SQLite`);

    // Insert players into MongoDB
    await Player.insertMany(players);
    console.log('All players migrated to MongoDB successfully');
  } catch (err) {
    console.error('Error migrating players:', err);
  } finally {
    // Close SQLite connection
    await db.close();
    console.log('SQLite connection closed');
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migratePlayers();

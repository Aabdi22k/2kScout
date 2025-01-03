import express from "express";
import Player from "./models/Player.js";
import Team from './models/Team.js';

const router = express.Router();

// Get all players
router.get("/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove player from the list
router.delete("/player/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json({ message: "Player removed from the list" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add player to the list
router.post("/player", async (req, res) => {
  const player = new Player({
    name: req.body.name,
    position: req.body.position,
    overall: req.body.overall,
    img: req.body.img,
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


export default router;

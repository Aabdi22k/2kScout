import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  overall: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: true,
  }
});

const Player = mongoose.model('Player', playerSchema);

export default Player;

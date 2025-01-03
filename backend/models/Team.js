import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  players: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
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
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model('Team', teamSchema);

export default Team;

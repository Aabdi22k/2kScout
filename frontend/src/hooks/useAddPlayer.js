import { useState } from 'react';

const useAddPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPlayer = async (playerData) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
      });

      if (!response.ok) {
        throw new Error('Failed to add player');
      }

      const newPlayer = await response.json();
      return newPlayer; // Return the new player data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addPlayer, loading, error };
};

export default useAddPlayer;

import { useState } from 'react';

const useDeletePlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePlayer = async (playerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/player/${playerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      // Optionally return a success message or response
      return response.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deletePlayer, loading, error };
};

export default useDeletePlayer;

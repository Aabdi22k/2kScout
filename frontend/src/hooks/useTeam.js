import { useState, useEffect } from "react";

const useTeam = (url) => {
  const [team, setTeam] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();

        setTeam(data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [url]);

  return { team, loading, error };
};

export default useTeam;

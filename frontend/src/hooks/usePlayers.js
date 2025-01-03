import { useState, useEffect } from "react";

const usePlayers = (url) => {
  const [pgPlayers, setPgPlayers] = useState([]);
  const [sgPlayers, setSgPlayers] = useState([]);
  const [sfPlayers, setSfPlayers] = useState([]);
  const [pfPlayers, setPfPlayers] = useState([]);
  const [cPlayers, setCPlayers] = useState([]);
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

        // Split players by position and sort by overall rating
        setPgPlayers(
          data.filter((player) => player.position === "point-guard").sort((a, b) => b.overall - a.overall)
        );
        setSgPlayers(
          data.filter((player) => player.position === "shooting-guard").sort((a, b) => b.overall - a.overall)
        );
        setSfPlayers(
          data.filter((player) => player.position === "small-forward").sort((a, b) => b.overall - a.overall)
        );
        setPfPlayers(
          data.filter((player) => player.position === "power-forward").sort((a, b) => b.overall - a.overall)
        );
        setCPlayers(
          data.filter((player) => player.position === "center").sort((a, b) => b.overall - a.overall)
        );

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [url]);

  return { pgPlayers, sgPlayers, sfPlayers, pfPlayers, cPlayers, loading, error };
};

export default usePlayers;

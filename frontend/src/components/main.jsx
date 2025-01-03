import React, { useState, useEffect } from "react";
import usePlayers from "../hooks/usePlayers";
const Main = () => {
  const {
    pgPlayers,
    sgPlayers,
    sfPlayers,
    pfPlayers,
    cPlayers,
    loading: playerLoading,
    error: playerError,
  } = usePlayers("https://twokscout.onrender.com/players");

  const [pgs, setpgs] = useState([]);
  const [sgs, setsgs] = useState([]);
  const [sfs, setsfs] = useState([]);
  const [pfs, setpfs] = useState([]);
  const [cs, setcs] = useState([]);

  // Reset Team
  const reset = () => {
    localStorage.setItem('team', JSON.stringify([]))
    return []; // return an empty team if none exists
  };

  const [team, setTeam] = useState(reset());

  // remove player from list depending on Position
  const deletePlayerFromPosition = (player) => {
    if (player.position === "point-guard") {
      setpgs((prevPgs) => prevPgs.filter((p) => p._id !== player._id));
    } else if (player.position === "shooting-guard") {
      setsgs((prevSgs) => prevSgs.filter((p) => p._id !== player._id));
    } else if (player.position === "small-forward") {
      setsfs((prevSfs) => prevSfs.filter((p) => p._id !== player._id));
    } else if (player.position === "power-forward") {
      setpfs((prevPfs) => prevPfs.filter((p) => p._id !== player._id));
    } else if (player.position === "center") {
      setcs((prevCs) => prevCs.filter((p) => p._id !== player._id));
    }
  };

  // Add player to list depending on Position
  const addPlayerToPosition = (player) => {
    if (player.position === "point-guard") {
      setpgs((prevPgs) => {
        const updatedPgs = [...prevPgs, player];
        return updatedPgs.sort((a, b) => b.overall - a.overall); // Sort by `overall` (descending)
      });
    } else if (player.position === "shooting-guard") {
      setsgs((prevSgs) => {
        const updatedSgs = [...prevSgs, player];
        return updatedSgs.sort((a, b) => b.overall - a.overall);
      });
    } else if (player.position === "small-forward") {
      setsfs((prevSfs) => {
        const updatedSfs = [...prevSfs, player];
        return updatedSfs.sort((a, b) => b.overall - a.overall);
      });
    } else if (player.position === "power-forward") {
      setpfs((prevPfs) => {
        const updatedPfs = [...prevPfs, player];
        return updatedPfs.sort((a, b) => b.overall - a.overall);
      });
    } else if (player.position === "center") {
      setcs((prevCs) => {
        const updatedCs = [...prevCs, player];
        return updatedCs.sort((a, b) => b.overall - a.overall);
      });
    }
  };
  
  // Handle Adding player to the team and removing them from their list
  const handleAddPlayer = async (player) => {
    // Step 1: Delete the player from the player list using the useDeletePlayer hook
    deletePlayerFromPosition(player)

    // Step 2: Update the team in localStorage
    const currentTeam = JSON.parse(localStorage.getItem("team")) || [];
    const updatedTeam = [...currentTeam, player]; // Add player to the team
    localStorage.setItem("team", JSON.stringify(updatedTeam)); // Save the updated team
    setTeam(updatedTeam);
  };
  
  // Handle deleting player from the team and adding them back to their list
  const handleDeletePlayerFromTeam = (playerId, player) => {
    // Filter out the player with the given id
    const updatedTeam = team.filter((player) => player._id !== playerId);

    // Update localStorage with the new team
    localStorage.setItem("team", JSON.stringify(updatedTeam));

    // Update the state to trigger a UI re-render
    setTeam(updatedTeam);

    // Add player back to the player list using the addPlayer hook
    // addPlayer(player); // Assuming this is the function that adds a player back to the list
    addPlayerToPosition(player)
  };

  // Handle remove player from their respective list
  const handleDeletePlayer = (player) => {
    deletePlayerFromPosition(player)
  };

  // Use useEffect to update state when players are fetched
  useEffect(() => {
    if (!playerLoading && !playerError) {
      setpgs(pgPlayers || []);
      setsgs(sgPlayers || []);
      setsfs(sfPlayers || []);
      setpfs(pfPlayers || []);
      setcs(cPlayers || []);
    }
  }, [
    pgPlayers,
    sgPlayers,
    sfPlayers,
    pfPlayers,
    cPlayers,
    playerLoading,
    playerError,
  ]);

  // Map positions to their respective player arrays
  const positions = [
    { name: "Point Guard", players: pgs },
    { name: "Shooting Guard", players: sgs },
    { name: "Small Forward", players: sfs },
    { name: "Power Forward", players: pfs },
    { name: "Center", players: cs },
  ];

  if (playerLoading) return <div>Loading...</div>;
  if (playerError) return <div>{playerError}</div>;
  return (
    <div>
      <div className="w-full bg-neutral-800 shadow-lg h-screen overflow-hidden p-8">
        {" "}
        <header className="flex justify-center items-center pb-8">
          <h1 className="text-3xl font-title text-neutral-50">2K Scout</h1>
        </header>
        <div className="grid  grid-cols-3 grid-rows-2 h-full gap-6 pb-16">
          <div className="bg-neutral-700 shadow-md rounded-md  p-6">
            <h2 className="text-lg font-semibold text-neutral-50 pb-4">
              My Team
            </h2>
            <table className="w-full border-collapse table-auto text-neutral-50">
              <thead>
                <tr className="bg-neutral-600">
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3 flex gap-10">
                    <span>Img</span>
                    <span>Name</span>
                  </th>
                  <th className="text-left p-3">Ovr</th>

                  <th className="text-center px-3 ">Del</th>
                </tr>
              </thead>
              <tbody>
                {team.map((player, index) => (
                  <tr key={player._id} className="hover:bg-neutral-600">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 flex gap-6">
                      <div className="w-[48px] h-[48px] rounded-full pt-3 overflow-clip bg-[#afafaf]">
                        <img
                          src={player.img}
                          alt={player.name}
                          className="rounded-full w-[48px] h-[35px] scale-150"
                        />
                      </div>
                      <span>{player.name}</span>
                    </td>
                    <td className="p-3">{player.overall}</td>

                    <td
                      className="text-center px-3 text-2xl text-red-500 cursor-pointer"
                      onClick={() =>
                        handleDeletePlayerFromTeam(player._id, player)
                      }
                    >
                      &#8722;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {positions.map(({ name, players }) => (
            <div
              className="bg-neutral-700 shadow-md rounded-lg overflow-hidden p-6"
              key={name}
            >
              <h2 className="text-lg font-semibold text-neutral-50 mb-4">
                {name}
              </h2>
              <div className="w-full max-h-[400px] overflow-y-scroll">
                <table className="w-full table-auto text-neutral-50 border-collapse">
                  <thead className="bg-neutral-600 sticky top-0 z-10">
                    <tr>
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3 flex gap-10">
                        <span>Img</span>
                        <span>Name</span>
                      </th>
                      <th className="text-left p-3">Ovr</th>
                      <th className="text-center px-3">Add</th>
                      <th className="text-center px-3">Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr key={player._id} className="hover:bg-neutral-600">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 flex gap-6">
                          <div className="w-[48px] h-[48px] rounded-full pt-3 overflow-clip bg-[#afafaf]">
                            <img
                              src={player.img}
                              alt={player.name}
                              className=" rounded-full w-[48px] h-[35px] scale-150 "
                            />
                          </div>
                          <span>{player.name}</span>
                        </td>
                        <td className="p-3">{player.overall}</td>
                        <td
                          className="text-center px-3 text-2xl text-green-500 cursor-pointer"
                          onClick={() => handleAddPlayer(player)}
                        >
                          &#43;
                        </td>
                        <td className="text-center px-3 text-2xl text-red-500 cursor-pointer" onClick={() => handleDeletePlayer(player)} >
                          &#8722;
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;

import React, { useState, useEffect } from "react";
import usePlayers from "../hooks/usePlayers";
const Main = () => {
  const getDeletedPlayers = () => {
    const deletedPlayers = JSON.parse(localStorage.getItem("deletedPlayers"));
    return deletedPlayers || [];
  };
  const [deletedPlayers, setDeletedPlayers] = useState(getDeletedPlayers());
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

  const getTeam = () => {
    const team = JSON.parse(localStorage.getItem("team"));
    return team || []; // return an empty team if none exists
  };

  const [team, setTeam] = useState(getTeam());

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
    deletePlayerFromPosition(player);

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
    addPlayerToPosition(player);
  };

  // Handle remove player from their respective list
  const handleDeletePlayer = (player) => {
    deletePlayerFromPosition(player);
    const updatedDeletedPlayers = [...deletedPlayers, player];
    localStorage.setItem(
      "deletedPlayers",
      JSON.stringify(updatedDeletedPlayers)
    );
    setDeletedPlayers(updatedDeletedPlayers);
  };

  const handleUndoDeletePlayer = () => {
    // If there are deleted players, undo the last deletion
    if (deletedPlayers.length > 0) {
      const lastDeletedPlayer = deletedPlayers[deletedPlayers.length - 1];
      const updatedDeletedPlayers = deletedPlayers.slice(
        0,
        deletedPlayers.length - 1
      ); // Remove last player
      localStorage.setItem(
        "deletedPlayers",
        JSON.stringify(updatedDeletedPlayers)
      );
      setDeletedPlayers(updatedDeletedPlayers);

      // Add the last deleted player back to their original position
      addPlayerToPosition(lastDeletedPlayer);
    }
  };

  const handleReset = () => {
    // Clear all deleted players from state and localStorage
    const allDeletedPlayers = [...deletedPlayers];
    const allTeamPlayers = [...team];
    localStorage.setItem("deletedPlayers", JSON.stringify([]));
    localStorage.setItem("team", JSON.stringify([]));
    setDeletedPlayers([]);
    setTeam([]);

    // Add all deleted players back to their positions
    allDeletedPlayers.forEach((player) => {
      addPlayerToPosition(player); // Restore each player back to their position
    });
    allTeamPlayers.forEach((player) => {
      addPlayerToPosition(player);
    });
  };

  useEffect(() => {
    if (!playerLoading && !playerError) {
      setpgs(pgPlayers || []);
      setsgs(sgPlayers || []);
      setsfs(sfPlayers || []);
      setpfs(pfPlayers || []);
      setcs(cPlayers || []);

      // Check for team in localStorage
      const team = JSON.parse(localStorage.getItem("team"));
      const deletedPlayers = JSON.parse(localStorage.getItem("deletedPlayers"));
      if (team && team.length > 0) {
        // Loop through the team and remove players from the respective positions
        team.forEach((player) => {
          switch (player.position) {
            case "point-guard":
              setpgs((prevPgs) =>
                prevPgs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "shooting-guard":
              setsgs((prevSgs) =>
                prevSgs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "small-forward":
              setsfs((prevSfs) =>
                prevSfs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "power-forward":
              setpfs((prevPfs) =>
                prevPfs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "center":
              setcs((prevCs) =>
                prevCs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            default:
              break;
          }
        });
      }
      if (deletedPlayers && deletedPlayers.length > 0) {
        deletedPlayers.forEach((player) => {
          switch (player.position) {
            case "point-guard":
              setpgs((prevPgs) =>
                prevPgs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "shooting-guard":
              setsgs((prevSgs) =>
                prevSgs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "small-forward":
              setsfs((prevSfs) =>
                prevSfs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "power-forward":
              setpfs((prevPfs) =>
                prevPfs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            case "center":
              setcs((prevCs) =>
                prevCs.filter((prevplayer) => prevplayer._id !== player._id)
              );
              break;
            default:
              break;
          }
        });
      }
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

  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  if (playerLoading) return <div>Loading...</div>;
  if (playerError) return <div>{playerError}</div>;
  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-neutral-800 text-neutral-50 rounded-lg shadow-lg max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-neutral-50 text-xl font-bold hover:scale-110 transition-transform"
            >
              &#x2715; {/* Unicode for "X" */}
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to 2K Scout!
            </h2>
            <p className="mb-4">
              This tool helps you build your Fantasy Basketball team effectively based on 2K25 stats for each player. Below are the top 100 players from each position (500 total). Follow
              the instructions below to get started:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Scroll down to find the other positions</li>
              <li>Scroll through the positions to find a player</li>
              <li>Add players to your team using the "+" button.</li>
              <li>Remove players using the "−" button.</li>
              <li>Undo deletions with the "Undo Delete" button.</li>
              <li>Reset everything with the "Reset" button.</li>
              <li>View the directions again with the "Directions" button</li>
            </ul>
          </div>
        </div>
      )}
      <div className="w-full bg-neutral-800 shadow-lg overflow-y-scroll p-8">
        {" "}
        <header className="flex justify-between px-4 items-center pb-8">
          <h1 className="text-3xl font-title text-neutral-50">2K Scout</h1>
          <div className="flex gap-6">
            <button
              className="bg-neutral-700 px-3 py-2 text-neutral-50 font-semibold rounded-lg hover:scale-105 transition-transform"
              onClick={() => handleUndoDeletePlayer()}
            >
              Undo Delete
            </button>
            <button
              className="bg-neutral-700 px-3 py-2 text-neutral-50 font-semibold rounded-lg hover:scale-105 transition-transform"
              onClick={() => handleReset()}
            >
              Reset
            </button>
            <button
              className="bg-neutral-700 px-3 py-2 text-neutral-50 font-semibold rounded-lg hover:scale-105 transition-transform"
              onClick={() => setShowModal(true)}
            >
              Directions
            </button>
          </div>
        </header>
        <div className="grid  grid-cols-1 md2:grid-cols-2 lg2:grid-cols-3 grid-rows-2 h-full gap-8 pb-16">
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
                <table className="w-full  text-neutral-50 border-collapse">
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
                        <td className="p-3 flex gap-6 ">
                          {/* Player Image */}
                          <div className="w-[48px] h-[48px] rounded-full pt-3 overflow-hidden bg-[#afafaf] flex items-center justify-center">
                            <img
                              src={player.img}
                              alt={player.name}
                              className="rounded-full w-[48px] h-[35px] scale-150"
                            />
                          </div>

                          {/* Player Name */}
                          <div>
                            <span className="flex whitespace-nowrap overflow-hidden">
                              {player.name}
                            </span>
                          </div>
                        </td>

                        <td className="p-3">{player.overall}</td>
                        <td
                          className="text-center px-3 text-2xl text-green-500 cursor-pointer"
                          onClick={() => handleAddPlayer(player)}
                        >
                          &#43;
                        </td>
                        <td
                          className="text-center px-3 text-2xl text-red-500 cursor-pointer"
                          onClick={() => handleDeletePlayer(player)}
                        >
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

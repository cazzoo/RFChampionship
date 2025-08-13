import React, { useEffect, useState } from 'react';

interface Game {
  id: number;
  name: string;
  shortName: string;
  description: string;
}

const ManageGamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      setGames(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/games/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete game');
        fetchGames(); // Refresh the list
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  // TODO: Add forms for creating and editing games

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Games</h1>
      {/* TODO: Add a "Create Game" button here */}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Short Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.name}</td>
                <td>{game.shortName}</td>
                <td>
                  <button className="btn btn-sm btn-outline btn-info mr-2">Edit</button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDelete(game.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageGamesPage;

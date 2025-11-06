import { useEffect, useState } from 'react';

interface Game {
  id: number;
  name: string;
  shortName: string;
  description: string;
}

const GamesPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGames();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{game.name}</h2>
              <p>{game.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Championships</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;

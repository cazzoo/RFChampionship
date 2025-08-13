import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Championship {
  id: number;
  name: string;
  description: string;
}

const ChampionshipsPage = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        const response = await fetch('/api/championships');
        if (!response.ok) {
          throw new Error('Failed to fetch championships');
        }
        const data = await response.json();
        setChampionships(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchChampionships();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Championships</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {championships.map((championship) => (
          <div key={championship.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{championship.name}</h2>
              <p>{championship.description}</p>
              <div className="card-actions justify-end">
                <Link to={`/championships/${championship.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChampionshipsPage;

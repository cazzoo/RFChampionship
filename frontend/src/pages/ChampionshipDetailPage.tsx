import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Championship {
  id: number;
  name: string;
  description: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
}

const ChampionshipDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    const fetchChampionshipDetails = async () => {
      try {
        // Fetch championship details
        const champResponse = await fetch(`/api/championships/${id}`);
        if (!champResponse.ok) {
          throw new Error('Failed to fetch championship details');
        }
        const champData = await champResponse.json();
        setChampionship(champData);

        // Fetch championship events
        const eventsResponse = await fetch(`/api/championships/${id}/events`);
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch championship events');
        }
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id) {
      fetchChampionshipDetails();
    }
  }, [id]);

  const handleRegister = async () => {
    setError(null);
    setMessage(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/championships/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setMessage('Successfully registered for the championship!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!championship) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{championship.name}</h1>
          <p className="mb-4">{championship.description}</p>
        </div>
        {isLoggedIn && (
          <button className="btn btn-primary" onClick={handleRegister}>
            Register for Championship
          </button>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <h2 className="text-2xl font-bold mt-6 mb-4">Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h3 className="card-title">{event.name}</h3>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChampionshipDetailPage;

import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents'; // Adjust path as necessary
import type { Event } from '../types/event.ts'; // Adjust path as necessary

const EventsListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const championshipId = searchParams.get('championshipId'); // For filtering, if used
  const [page] = useState(1); // Basic pagination state
  const { events, loading, error } = useEvents(championshipId, page, 10);

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading events: {error.message}</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10">
        No events found.
        {championshipId && " for this championship."}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {championshipId ? 'Events for Championship' : 'All Events'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: Event) => (
          <div key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-700">{event.name}</h2>
              <p className="text-gray-600 text-sm mb-1">
                Date: {new Date(event.event_date).toLocaleDateString()}
              </p>
              {event.location && (
                <p className="text-gray-600 text-sm mb-1">Location: {event.location}</p>
              )}
              <p className="text-gray-600 text-sm mb-3">
                Status: <span className="font-medium capitalize">{event.status || 'Unknown'}</span>
              </p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{event.description || 'No description available.'}</p>
              <Link
                to={`/events/${event.id}`}
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Basic Pagination (can be improved) */}
      {/* <div className="mt-8 flex justify-center"> ... </div> */}
    </div>
  );
};

export default EventsListPage;

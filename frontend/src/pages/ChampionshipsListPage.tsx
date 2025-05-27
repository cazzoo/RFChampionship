import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChampionships } from '../hooks/useChampionships'; // Adjust path as necessary
import { Championship } from '../types/championship'; // Adjust path as necessary

const ChampionshipsListPage: React.FC = () => {
  const [page] = useState(1); // Basic pagination state, can be expanded
  const { championships, loading, error } = useChampionships(page, 10); // Fetch 10 per page

  if (loading) {
    return <div className="text-center py-10">Loading championships...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading championships: {error.message}</div>;
  }

  if (!championships || championships.length === 0) {
    return <div className="text-center py-10">No championships found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Championships</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {championships.map((championship: Championship) => (
          <div key={championship.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-700">{championship.name}</h2>
              <p className="text-gray-600 text-sm mb-1">
                Dates: {championship.start_date ? new Date(championship.start_date).toLocaleDateString() : 'TBA'} - {championship.end_date ? new Date(championship.end_date).toLocaleDateString() : 'TBA'}
              </p>
              <p className="text-gray-600 text-sm mb-3">
                Status: <span className="font-medium capitalize">{championship.status || 'Unknown'}</span>
              </p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{championship.description || 'No description available.'}</p>
              <Link 
                to={`/championships/${championship.id}`} 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Basic Pagination (can be improved with actual page numbers and next/prev buttons) */}
      {/* <div className="mt-8 flex justify-center">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          Prev
        </button>
        <span className="py-2 px-4">Page {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)} 
          // Add disabled logic if you know total pages
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default ChampionshipsListPage;

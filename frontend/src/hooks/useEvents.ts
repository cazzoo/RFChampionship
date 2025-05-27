import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient'; // Adjust path as necessary
import { Event } from '../types/event'; // Create this type

// Define the Event type - consider moving to a types directory
// export interface Event {
//   id: string;
//   name: string;
//   description?: string;
//   event_date: string; // ISO date string
//   championship_id: string;
//   location?: string;
//   status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
//   created_by?: string; // User ID
//   created_at?: string;
//   updated_at?: string;
//   // championship?: Partial<Championship>; // If you populate this
// }

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useEvents = (championshipId?: string | null, page: number = 1, limit: number = 10): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    let url = `/api/events?page=${page}&limit=${limit}`;
    if (championshipId) {
      url += `&championship_id=${championshipId}`;
    }

    try {
      // Assuming your API returns an object like { events: [], total: X, page: Y, limit: Z }
      const response = await apiClient.get<{ events: Event[], total: number }>(url);
      setEvents(response.events || []); // Ensure it's an array
    } catch (err: any) {
      setError(err);
      setEvents([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if championshipId is provided, or if we intend to fetch all events when it's null/undefined
    // For now, let's assume we always fetch, and the API handles missing championshipId as "all events"
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [championshipId, page, limit]); // Refetch if championshipId, page, or limit changes

  return { events, loading, error, refetch: fetchEvents };
};


// Hook for a single event
interface UseEventReturn {
    event: Event | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}
export const useEvent = (id: string | undefined): UseEventReturn => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchEvent = async () => {
        if (!id) {
            setLoading(false);
            // setError(new Error("Event ID is required."));
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.get<Event>(`/api/events/${id}`);
            setEvent(data);
        } catch (err: any) {
            setError(err);
            setEvent(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { event, loading, error, refetch: fetchEvent };
};

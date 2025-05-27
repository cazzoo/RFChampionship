import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Event, EventCreationData, EventUpdateData } from '../types/event';
import { Championship } from '../types/championship'; // For select dropdown in form
import { Track } from '../types/track'; // For select dropdown in form

interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminEventsReturn {
  events: Event[];
  totalEvents: number;
  championships: Championship[]; // For form select
  tracks: Track[]; // For form select
  loading: boolean;
  error: Error | null;
  fetchEvents: (page?: number, limit?: number, championshipId?: string | null) => Promise<void>;
  addEvent: (eventData: EventCreationData) => Promise<Event | null>;
  updateEvent: (id: string, eventData: EventUpdateData) => Promise<Event | null>; // ID is string (UUID)
  deleteEvent: (id: string) => Promise<boolean>;
  fetchRelatedDataForForm: () => Promise<void>; // To get championships and tracks
}

export const useAdminEvents = (initialPage: number = 1, initialLimit: number = 10): UseAdminEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentChampionshipFilter, setCurrentChampionshipFilter] = useState<string | null | undefined>(undefined);

  const fetchEvents = useCallback(async (page: number = currentPage, limit: number = currentLimit, championshipId: string | null | undefined = currentChampionshipFilter) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentChampionshipFilter(championshipId);

    let url = `/api/events?page=${page}&limit=${limit}`;
    if (championshipId) {
      url += `&championship_id=${championshipId}`;
    }
    
    try {
      const data = await apiClient.get<PaginatedEvents>(url);
      setEvents(data.events || []);
      setTotalEvents(data.total || 0);
    } catch (err: any) {
      setError(err);
      setEvents([]);
      setTotalEvents(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentChampionshipFilter]);
  
  const fetchRelatedDataForForm = useCallback(async () => {
    setLoading(true); // Or a separate loading state for this
    try {
      const champPromise = apiClient.get<{championships: Championship[]}>('/api/championships?limit=1000'); // Fetch all for select
      const trackPromise = apiClient.get<{tracks: Track[]}>('/api/tracks?limit=1000'); // Fetch all for select
      
      const [champResponse, trackResponse] = await Promise.all([champPromise, trackPromise]);
      
      setChampionships(champResponse.championships || []);
      setTracks(trackResponse.tracks || []);
      setError(null);
    } catch (err: any) {
        console.error("Failed to fetch related data for event form:", err);
        setError(err);
        setChampionships([]);
        setTracks([]);
    } finally {
        setLoading(false); // Or the separate loading state
    }
  }, []);


  useEffect(() => {
    fetchEvents(initialPage, initialLimit);
    // fetchRelatedDataForForm(); // Call if form data is needed immediately or on demand when form opens
  }, [fetchEvents, initialPage, initialLimit]);

  const addEvent = async (eventData: EventCreationData): Promise<Event | null> => {
    setLoading(true);
    try {
      const newEvent = await apiClient.post<Event>('/api/events', eventData);
      setError(null);
      await fetchEvents(); // Refetch
      return newEvent;
    } catch (err: any) {
      setError(err);
      console.error("Failed to add event:", err);
      setLoading(false);
      return null;
    }
  };

  const updateEvent = async (id: string, eventData: EventUpdateData): Promise<Event | null> => {
    setLoading(true);
    try {
      const updatedEvent = await apiClient.put<Event>(`/api/events/${id}`, eventData);
      setError(null);
      await fetchEvents(); // Refetch
      return updatedEvent;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to update event ${id}:`, err);
      setLoading(false);
      return null;
    }
  };

  const deleteEvent = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/events/${id}`);
      setError(null);
      await fetchEvents(); // Refetch
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to delete event ${id}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { 
    events, 
    totalEvents, 
    championships,
    tracks,
    loading, 
    error, 
    fetchEvents, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    fetchRelatedDataForForm
  };
};

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { Rule, RuleCreationData, RuleUpdateData } from '../types/rule.ts';
import type { Championship } from '../types/championship.ts'; // For fetching championships for the Select dropdown

interface PaginatedRules {
  rules: Rule[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminRulesReturn {
  rules: Rule[];
  totalRules: number;
  championships: Championship[]; // For the form's select dropdown
  loading: boolean;
  error: Error | null;
  fetchRules: (page?: number, limit?: number, championshipId?: number | null) => Promise<void>;
  addRule: (ruleData: RuleCreationData) => Promise<Rule | null>;
  updateRule: (id: number, ruleData: RuleUpdateData) => Promise<Rule | null>;
  deleteRule: (id: number) => Promise<boolean>;
  fetchChampionshipsForSelect: () => Promise<void>;
}

export const useAdminRules = (initialPage: number = 1, initialLimit: number = 10): UseAdminRulesReturn => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [totalRules, setTotalRules] = useState(0);
  const [championships, setChampionships] = useState<Championship[]>([]); // For select dropdown
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentChampionshipIdFilter, setCurrentChampionshipIdFilter] = useState<number | null | undefined>(undefined);


  const fetchRules = useCallback(async (page: number = currentPage, limit: number = currentLimit, championshipId: number | null | undefined = currentChampionshipIdFilter) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentChampionshipIdFilter(championshipId);

    let url = `/api/rules?page=${page}&limit=${limit}`;
    if (championshipId !== undefined && championshipId !== null) {
      url += `&championship_id=${championshipId}`;
    } else if (championshipId === null) { // Explicitly fetch global rules
      url += `&global_only=true`;
    }
    // If championshipId is undefined, all rules are fetched (backend default)

    try {
      const data = await apiClient.get<PaginatedRules>(url);
      setRules(data.rules || []);
      setTotalRules(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setRules([]);
      setTotalRules(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentChampionshipIdFilter]);

  const fetchChampionshipsForSelect = useCallback(async () => {
    // Fetch all championships (or a reasonable number for a select dropdown)
    // Assuming your championships API supports a high limit or no pagination for this use case
    setLoading(true); // Could use a separate loading state for this
    try {
      const data = await apiClient.get<{championships: Championship[]}>('/api/championships?limit=1000'); // Fetch many for select
      setChampionships(data.championships || []);
    } catch (err) {
      console.error("Failed to fetch championships for select:", err);
      setChampionships([]);
    }
    // setLoading(false); // If using separate loading state
  }, []);


  useEffect(() => {
    fetchRules(initialPage, initialLimit, undefined); // Initial fetch for all rules
    fetchChampionshipsForSelect(); // Fetch championships for the form
  }, [fetchRules, fetchChampionshipsForSelect, initialPage, initialLimit]);

  const addRule = async (ruleData: RuleCreationData): Promise<Rule | null> => {
    setLoading(true);
    try {
      const newRule = await apiClient.post<Rule>('/api/rules', ruleData);
      setError(null);
      await fetchRules(); // Refetch
      return newRule;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error("Failed to add rule:", err);
      setLoading(false);
      return null;
    }
  };

  const updateRule = async (id: number, ruleData: RuleUpdateData): Promise<Rule | null> => {
    setLoading(true);
    try {
      const updatedRule = await apiClient.put<Rule>(`/api/rules/${id}`, ruleData);
      setError(null);
      await fetchRules(); // Refetch
      return updatedRule;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Failed to update rule ${id}:`, err);
      setLoading(false);
      return null;
    }
  };

  const deleteRule = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/rules/${id}`);
      setError(null);
      await fetchRules(); // Refetch
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Failed to delete rule ${id}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { rules, totalRules, championships, loading, error, fetchRules, addRule, updateRule, deleteRule, fetchChampionshipsForSelect };
};

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for data fetching with loading, error states, and refetch capability
 * 
 * @param url - The URL to fetch data from
 * @param options - Axios request options
 * @param initialData - Optional initial data
 * @param skipInitialFetch - Whether to skip the initial fetch
 * @returns The fetch state: { data, loading, error, refetch }
 */
function useFetch<T = any>(
  url: string, 
  options?: any,
  initialData: T | null = null,
  skipInitialFetch = false
): UseFetchState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!skipInitialFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: AxiosResponse<T> = await axios({
        url,
        ...options,
      });
      
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!skipInitialFetch) {
      fetchData();
    }
    
    return () => {
      // Cleanup function if needed
    };
  }, [skipInitialFetch, fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Create a loading state component for skeleton loaders
 * 
 * @param props - Component props
 * @returns Either the skeleton or the children
 */
interface LoadingStateProps {
  isLoading: boolean;
  Skeleton: React.ReactNode;
  children: React.ReactNode;
}

function LoadingState({ isLoading, Skeleton, children }: LoadingStateProps): React.ReactElement {
  return isLoading ? <>{Skeleton}</> : <>{children}</>;
}

export { useFetch, LoadingState };

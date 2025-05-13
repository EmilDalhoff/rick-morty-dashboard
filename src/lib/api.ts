import { ApiResponse, Character } from '../types';
import { FilterOptions } from '@/components/CharacterFilter';

// Keep track of ongoing requests to prevent duplicate API calls
const pendingRequests = new Map<string, Promise<ApiResponse<Character>>>();

export async function getCharacters(
  page = 1, 
  name = '', 
  filters: FilterOptions = { status: null, gender: null, species: null }
): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  
  if (name) params.append('name', name);
  if (filters.status) params.append('status', filters.status);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.species) params.append('species', filters.species);
  
  // Create a request key based on all parameters
  const requestKey = params.toString();
  
  // If there's already a pending request for this key, return it
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }
  
  // Create and store the request promise
  const requestPromise = (async () => {
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?${params}`);
      
      if (!response.ok) {
        // Return empty result structure for 404 (no results found)
        if (response.status === 404) {
          return {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: []
          };
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } finally {
      // Clean up the pending request when done
      setTimeout(() => pendingRequests.delete(requestKey), 100);
    }
  })();
  
  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
}
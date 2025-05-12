// lib/api.ts
import { ApiResponse, Character } from '../types';

// Keep track of ongoing requests to prevent duplicate API calls
const pendingRequests = new Map<string, Promise<ApiResponse<Character>>>();

export async function getCharacters(page = 1, name = ''): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (name) params.append('name', name);
  
  // Create a request key based on the parameters
  const requestKey = `page=${page}&name=${name}`;
  
  // If there's already a pending request for this key, return it
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }
  
  // Create and store the request promise
  const requestPromise = (async () => {
    try {
      console.log(`Making API request for ${requestKey}`);
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
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    } finally {
      // Clean up the pending request when done
      setTimeout(() => {
        pendingRequests.delete(requestKey);
      }, 100);
    }
  })();
  
  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
}
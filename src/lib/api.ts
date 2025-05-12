import { ApiResponse, Character } from '../types';

export async function getCharacters(page = 1, name = ''): Promise<ApiResponse<Character>> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (name) params.append('name', name);
  
  const response = await fetch(`https://rickandmortyapi.com/api/character?${params}`);
  
  if (!response.ok) {
    // If the search returns no results, the API returns a 404
    if (response.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: []
      };
    }
    throw new Error('Failed to fetch characters');
  }
  
  return response.json();
}
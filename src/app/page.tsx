// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/types';
import { getCharacters } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import CharacterTable from '@/components/CharacterTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        setLoading(true);
        const data = await getCharacters(currentPage, searchQuery);
        setCharacters(data.results);
        setTotalPages(data.info?.pages || 0);
      } catch (err) {
        setError('Failed to load characters');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCharacters();
  }, [currentPage, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Rick and Morty Characters</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {error ? (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6 text-center text-red-600">{error}</CardContent>
        </Card>
      ) : (
        <>
          <CharacterTable characters={characters} isLoading={loading} />
          
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-6 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Episode {
  id: number;
  name: string;
  episode: string; // format: S01E01
}

interface CharacterDetailProps {
  character: Character;
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        setLoading(true);
        // Fetch all episodes for the character
        const episodePromises = character.episode.map(url => 
          fetch(url).then(res => res.json())
        );
        const episodeData = await Promise.all(episodePromises);
        setEpisodes(episodeData);
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEpisodes();
  }, [character.episode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Character Information Card */}
      <Card className="md:col-span-1 shadow-sm">
        <CardHeader className="pb-2">
          <div className="relative w-full pb-[100%] rounded-md overflow-hidden mb-4">
            <img 
              src={character.image} 
              alt={character.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-xl">{character.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <Badge variant="outline" className={`${
                character.status === 'Alive' ? 'bg-green-100 text-green-800' : 
                character.status === 'Dead' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {character.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{character.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Species:</span>
              <span>{character.species}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Origin:</span>
              <span className="text-right truncate max-w-[180px]" title={character.origin.name}>
                {character.origin.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Location:</span>
              <span className="text-right truncate max-w-[180px]" title={character.location.name}>
                {character.location.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episodes Card */}
      <Card className="md:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Episodes ({character.episode.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-y-auto max-h-80 pr-1">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="py-2 px-4 text-left">Episode</th>
                    <th className="py-2 px-4 text-left">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {episodes.map(episode => (
                    <tr key={episode.id} className="border-b border-muted/60">
                      <td className="py-2 px-4 font-medium whitespace-nowrap">{episode.episode}</td>
                      <td className="py-2 px-4">{episode.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
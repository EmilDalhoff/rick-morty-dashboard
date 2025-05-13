'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { Episode as EpisodeType } from '@/types';

interface CharacterDetailProps {
  character: Character;
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
  const [episodes, setEpisodes] = useState<EpisodeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        setLoading(true);
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

  // Status badge styling based on character status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Alive':
        return <Badge variant="outline" className="bg-green-900/50 text-green-300 border-green-500">{status}</Badge>;
      case 'Dead':
        return <Badge variant="outline" className="bg-red-900/50 text-red-300 border-red-500">{status}</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-200 bg-[#1f3027]">
      
      <Card className="md:col-span-1 shadow-sm bg-[#1a2b24] border border-gray-700">
        <CardHeader className="pb-2">
          <div className="relative w-full pb-[100%] rounded-md overflow-hidden mb-4 border border-green-600">
            <img 
              src={character.image} 
              alt={character.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-xl text-green-300">{character.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-300">Status:</span>
              {getStatusBadge(character.status)}
            </div>
           
            <div className="flex justify-between">
              <span className="font-medium text-gray-300">Gender:</span>
              <span className="text-gray-300">{character.gender}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium text-gray-300">Species:</span>
              <span className="text-gray-300">{character.species}</span>
            </div>
          
            <div className="flex justify-between">
              <span className="font-medium text-gray-300">Origin:</span>
              <span className="text-right truncate max-w-[180px] text-gray-300" title={character.origin.name}>
                {character.origin.name}
              </span>
            </div>
           
            <div className="flex justify-between">
              <span className="font-medium text-gray-300">Location:</span>
              <span className="text-right truncate max-w-[180px] text-gray-300" title={character.location.name}>
                {character.location.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <Card className="md:col-span-1 shadow-sm bg-[#1a2b24] border border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-green-300">Episodes ({character.episode.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-[#1f3027]" />
              ))}
            </div>
          ) : (
            <div className="overflow-y-auto max-h-140 pr-1">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-4 text-left text-green-400">Episode</th>
                    <th className="py-2 px-4 text-left text-green-400">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {episodes.map(episode => (
                    <tr key={episode.id} className="border-b border-gray-700/60">
                      <td className="py-2 px-4 font-medium whitespace-nowrap text-green-200">{episode.episode}</td>
                      <td className="py-2 px-4 text-gray-300">{episode.name}</td>
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
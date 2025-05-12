'use client';

import { Character } from '@/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CharacterDetailProps {
  character: Character;
}

export default function CharacterDetail({ character }: CharacterDetailProps) {
  // Determine badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Alive':
        return <Badge variant="outline" className="bg-green-300 text-green-900 border-green-400">{status}</Badge>;
      case 'Dead':
        return <Badge variant="outline" className="bg-red-300 text-red-900 border-red-400">{status}</Badge>;
      default:
        return <Badge variant="outline" className="bg-purple-300 text-purple-900 border-purple-400">{status}</Badge>;
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{character.name}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="relative w-full h-64 md:w-1/3 md:h-auto">
          <Image
            src={character.image}
            alt={character.name}
            fill
            style={{objectFit: 'cover'}}
            className="rounded-md"
          />
        </div>
        <div className="md:w-2/3 space-y-3">
          <div className="flex gap-3 flex-wrap">
            {getStatusBadge(character.status)}
            <Badge variant="outline" className="bg-blue-100">{character.species}</Badge>
            <Badge variant="outline" className="bg-yellow-100">{character.gender}</Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Origin</h4>
            <p>{character.origin.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Location</h4>
            <p>{character.location.name}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-500">Episodes</h4>
            <p className="text-sm">{character.episode.length} episodes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
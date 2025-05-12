'use client';

import { Character } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

export default function CharacterCard({ character, onClick }: CharacterCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Alive':
        return <Badge variant="outline" className="bg-green-300 text-green-900 border-green-400 hover:bg-green-400">{status}</Badge>;
      case 'Dead':
        return <Badge variant="outline" className="bg-red-300 text-red-900 border-red-400 hover:bg-red-400">{status}</Badge>;
      default:
        return <Badge variant="outline" className="bg-purple-300 text-purple-900 border-purple-400 hover:bg-purple-400">{status}</Badge>;
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="w-full aspect-square relative">
        <Image
          src={character.image}
          alt={character.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          priority
        />
      </div>
      <CardContent className="p-3 flex-grow">
        <h3 className="font-bold truncate">{character.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">{character.species} • {character.gender}</div>
          <div>{getStatusBadge(character.status)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
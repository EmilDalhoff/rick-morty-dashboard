'use client';

import { useState } from 'react';
import { Character } from '@/types';
import CharacterDetail from './CharacterDetail';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CharacterRowProps {
  character: Character;
}

export default function CharacterRow({ character }: CharacterRowProps) {
  const [expanded, setExpanded] = useState(false);

  // Function to toggle expanded state
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Determine badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Alive':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case 'Dead':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">{status}</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  return (
    <>
      <tr 
        className="border-b border-muted hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={toggleExpand}
      >
        <td className="py-3 px-4 font-medium flex items-center gap-2">
          {character.name}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
        <td className="py-3 px-4 hidden sm:table-cell">{character.gender}</td>
        <td className="py-3 px-4">{getStatusBadge(character.status)}</td>
        <td className="py-3 px-4 hidden sm:table-cell">{character.species}</td>
        <td className="py-3 px-4 hidden md:table-cell">{character.location.name}</td>
        <td className="py-3 px-4 hidden md:table-cell text-center">{character.episode.length}</td>
      </tr>
      
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-muted/20 p-0">
            <div className="p-4">
              <CharacterDetail character={character} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
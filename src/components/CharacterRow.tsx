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
        return <Badge variant="outline" className="bg-green-900/50 text-green-300 border-green-500">{status}</Badge>;
      case 'Dead':
        return <Badge variant="outline" className="bg-red-900/50 text-red-300 border-red-500">{status}</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-500">{status}</Badge>;
    }
  };

  return (
    <>
      <tr 
        className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors"
        onClick={toggleExpand}
      >
        <td className="py-3 px-4 font-medium text-nowrap flex items-center gap-2 text-green-200">
          {character.name} 
          {expanded ? 
            <ChevronUp size={16} className="text-green-400" /> : 
            <ChevronDown size={16} className="text-green-400" />
          }
        </td>
        <td className="py-3 px-4 hidden sm:table-cell text-gray-300">{character.gender}</td>
        <td className="py-3 px-4">{getStatusBadge(character.status)}</td>
        <td className="py-3 px-4 hidden sm:table-cell text-gray-300">{character.species}</td>
        <td className="py-3 px-4 hidden md:table-cell text-gray-300">{character.location.name}</td>
        <td className="py-3 px-4 hidden md:table-cell text-center text-gray-300">{character.episode.length}</td>
      </tr>
      
      {expanded && (
        <tr>
          <td colSpan={6} className="bg-[#1f3027] p-0">
            <div className="p-4 ">
              <CharacterDetail character={character} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
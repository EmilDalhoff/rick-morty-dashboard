'use client';

import { Character } from '@/types';
import CharacterRow from './CharacterRow';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface CharacterTableProps {
  characters: Character[];
  isLoading: boolean;
}

export default function CharacterTable({ characters, isLoading }: CharacterTableProps) {
  // Create skeletons for loading state
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <TableRow key={`loading-${index}`}>
        <td colSpan={6} className="py-3 px-6">
          <Skeleton className="h-12 w-full bg-[#1f3027]" />
        </td>
      </TableRow>
    ));
  };

  return (
    <Card className="overflow-hidden rounded-md shadow-lg shadow-green-500/20 bg-[#1f3027] border border-green-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1a2b24] border-b border-green-700">
              <TableHead className="w-[200px] text-green-400">Name</TableHead>
              <TableHead className="hidden sm:table-cell text-green-400">Gender</TableHead>
              <TableHead className="text-green-400">Status</TableHead>
              <TableHead className="hidden sm:table-cell text-green-400">Species</TableHead>
              <TableHead className="hidden md:table-cell text-green-400">Location</TableHead>
              <TableHead className="hidden md:table-cell w-[100px] text-green-400">Episodes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletons()
            ) : characters.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="py-8 px-6 text-center text-green-300/70">
                  No characters found
                </td>
              </TableRow>
            ) : (
              characters.map(character => (
                <CharacterRow key={character.id} character={character} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
'use client';

import { Character } from '@/types';
import CharacterRow from './CharacterRow';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
          <Skeleton className="h-12 w-full" />
        </td>
      </TableRow>
    ));
  };

  return (
    <Card className="overflow-hidden rounded-md shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Gender</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Species</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell w-[100px]">Episodes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeletons()
            ) : characters.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="py-8 px-6 text-center text-muted-foreground">
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
'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface FilterOptions {
  status: string | null;
  gender: string | null;
  species: string | null;
}

interface CharacterFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export default function CharacterFilter({ onFilterChange, activeFilters }: CharacterFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statuses = ['Alive', 'Dead', 'unknown'];
  const genders = ['Female', 'Male', 'Genderless', 'unknown'];
  const commonSpecies = ['Human', 'Alien', 'Humanoid', 'Robot', 'Animal', 'Mythological Creature'];

  const toggleFilter = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...activeFilters,
      status: activeFilters.status === status ? null : status,
    });
  };

  const handleGenderChange = (gender: string) => {
    onFilterChange({
      ...activeFilters,
      gender: activeFilters.gender === gender ? null : gender,
    });
  };

  const handleSpeciesChange = (species: string) => {
    onFilterChange({
      ...activeFilters,
      species: activeFilters.species === species ? null : species,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: null,
      gender: null,
      species: null,
    });
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFilter}
          className="bg-[#1a2b24] border-[#44d579]/30 text-green-300 hover:bg-[#243830] hover:text-green-200"
        >
          <Filter size={16} className="mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-[#44d579] text-[#1a2b24]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-green-300 hover:text-green-200"
          >
            <X size={14} className="mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {isExpanded && (
        <Card className="p-4 shadow-lg shadow-[#44d579]/20 bg-[#1f3027] border border-[#44d579]/50 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <h3 className="font-medium text-green-300 mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Badge
                    key={status}
                    variant="outline"
                    className={`cursor-pointer ${
                      activeFilters.status === status
                        ? 'bg-green-900/50 text-green-300 border-green-500'
                        : 'bg-[#1a2b24] text-gray-300 border-gray-700 hover:bg-[#243830]'
                    }`}
                    onClick={() => handleStatusChange(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-green-300 mb-2">Gender</h3>
              <div className="flex flex-wrap gap-2">
                {genders.map((gender) => (
                  <Badge
                    key={gender}
                    variant="outline"
                    className={`cursor-pointer ${
                      activeFilters.gender === gender
                        ? 'bg-green-900/50 text-green-300 border-green-500'
                        : 'bg-[#1a2b24] text-gray-300 border-gray-700 hover:bg-[#243830]'
                    }`}
                    onClick={() => handleGenderChange(gender)}
                  >
                    {gender}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-green-300 mb-2">Species</h3>
              <div className="flex flex-wrap gap-2">
                {commonSpecies.map((species) => (
                  <Badge
                    key={species}
                    variant="outline"
                    className={`cursor-pointer ${
                      activeFilters.species === species
                        ? 'bg-green-900/50 text-green-300 border-green-500'
                        : 'bg-[#1a2b24] text-gray-300 border-gray-700 hover:bg-[#243830]'
                    }`}
                    onClick={() => handleSpeciesChange(species)}
                  >
                    {species}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
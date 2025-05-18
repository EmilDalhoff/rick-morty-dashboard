'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  // Using internal state for immediate UI feedback
  const [value, setValue] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(value);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  // Debounce the search query 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="mb-6 shadow-lg shadow-[#44d579]/20 bg-[#1f3027] border border-[#44d579]/50 rounded-md p-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#44d579] h-4 w-4" />
        <Input
          type="search"
          placeholder="Search by character name..."
          value={value}
          onChange={handleChange}
          className="pl-10 w-full bg-[#1a2b24] border-[#44d579]/30 text-gray-200 placeholder:text-gray-400 focus-visible:ring-[#44d579] focus-visible:border-[#44d579]"
        />
      </div>
    </div>
  );
}
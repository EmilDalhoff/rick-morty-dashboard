'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { Character } from '@/types'
import { getCharacters } from '@/lib/api'
import SearchBar from '@/components/SearchBar'
import CharacterTable from '@/components/CharacterTable'
import CharacterFilter, { FilterOptions } from '@/components/CharacterFilter'
import { useDebounce } from '@/hooks/useDebounce'

import { Card, CardContent } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function Home() {
  const searchParams = useSearchParams()
  
  // Get initial values from URL parameters
  const initialPage = Number(searchParams.get('page')) || 1
  const initialSearch = searchParams.get('search') || ''
  const initialFilters: FilterOptions = {
    status: searchParams.get('status') as FilterOptions['status'],
    gender: searchParams.get('gender') as FilterOptions['gender'],
    species: searchParams.get('species') as FilterOptions['species']
  }

  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const debouncedSearch = useDebounce(searchInput, 380) // Using a non-standard delay

  // Update URL when parameters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (searchQuery) params.set('search', searchQuery)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    window.history.replaceState(null, '', newUrl)
  }, [currentPage, searchQuery, filters])

  useEffect(() => {
    let isMounted = true

    async function fetchCharacters() {
      try {
        setLoading(true)
        const data = await getCharacters(currentPage, searchQuery, filters)

        if (!isMounted) return

        if (data?.results?.length > 0) {
          setCharacters(data.results)
          setTotalPages(data.info?.pages || 0)
          setError(null)
        } else {
          setCharacters([])
          setError('No characters found matching your criteria')
        }
      } catch (err) {
        if (!isMounted) return
        setError('Failed to load characters')
        setCharacters([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCharacters()
    return () => { isMounted = false }
  }, [currentPage, searchQuery, filters])

  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      setSearchQuery(debouncedSearch)
      // Only reset page if we're not on page 1 and search has changed
      if (currentPage !== 1) setCurrentPage(1)
    }
  }, [debouncedSearch])

  const handleSearch = (query: string) => {
    setSearchInput(query)
    // Page reset now happens in the effect when debouncedSearch changes
  }
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1) 
  }

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const renderFilterSummary = () => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => `${key}: ${value}`)
    
    if (activeFilters.length === 0) return null
    
    return (
      <div className="text-sm text-green-300 mt-1">
        Filtered by: {activeFilters.join(', ')}
      </div>
    )
  }

  // Create pagination URL params once to reuse in multiple places
  const getPaginationParams = (page: number) => {
    const params = new URLSearchParams()
    if (page) params.set('page', page.toString())
    if (searchQuery) params.set('search', searchQuery)
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    return `?${params.toString()}`
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={getPaginationParams(i)}
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return (
      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious 
                href={getPaginationParams(currentPage - 1)}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage - 1)
                }}
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
          )}

          {pages}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext 
                href={getPaginationParams(currentPage + 1)}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage + 1)
                }}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <main className="min-h-screen bg-[#1f3027]">
      <div className="container mx-auto px-4">
        <header className="bg-[#1f3027] text-white py-4 flex justify-between items-center border-b border-[#44d579]/30">
          <h1 className="text-lg sm:text-xl font-bold text-green-300">Rick & Morty Dashboard</h1>
          <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
            <Image
              src="/rickmorty.png"
              alt="Rick and Morty"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </header>

        <div className="py-6">
          <div className="mb-6">
            <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
            <CharacterFilter 
              onFilterChange={handleFilterChange} 
              activeFilters={filters}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-sm text-green-200">
                Page {currentPage} of {totalPages} • {characters.length} characters
              </div>
              {renderFilterSummary()}
            </div>
          </div>

          {error ? (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="pt-6 text-center text-red-600">{error}</CardContent>
            </Card>
          ) : loading && characters.length === 0 ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              <CharacterTable characters={characters} isLoading={loading} />
              <div className="flex justify-center items-center mt-6">
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
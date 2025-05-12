'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Character } from '@/types'
import { getCharacters } from '@/lib/api'
import SearchBar from '@/components/SearchBar'
import CharacterCard from '@/components/CharacterCard'
import CharacterDetail from '@/components/CharacterDetail'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchCharacters() {
      try {
        setLoading(true)
        console.log(`Making API request for page=${currentPage}&name=${searchQuery}`)

        const data = await getCharacters(currentPage, searchQuery)

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
        console.error('Error fetching characters:', err)
        setError('Failed to load characters')
        setCharacters([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchCharacters()

    return () => {
      isMounted = false
    }
  }, [currentPage, searchQuery])

  const handleSearch = (query: string) => {
    if (query !== searchQuery) {
      setSearchQuery(query)
      setCurrentPage(1)
    }
  }

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
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
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
            isActive={i === currentPage}
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
                href="#" 
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
                href="#" 
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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Rick and Morty Characters</h1>
        <div className="w-20 h-10 relative">
          <Image
            src="/rickmorty.png"
            alt="Rick and Morty"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Page {currentPage} of {totalPages} • {characters.length} characters
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6 text-center text-red-600">{error}</CardContent>
          </Card>
        ) : loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={() => setSelectedCharacter(character)}
                />
              ))}
            </div>

            <div className="flex justify-center items-center mt-6">
              {renderPagination()}
            </div>
          </>
        )}
      </div>

      <Dialog
        open={!!selectedCharacter}
        onOpenChange={(open) => !open && setSelectedCharacter(null)}
      >
        {selectedCharacter && (
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
            <CharacterDetail character={selectedCharacter} />
          </DialogContent>
        )}
      </Dialog>
    </main>
  )
}
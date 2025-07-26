import React from 'react';
import type { Book } from '../types/Book';
import BookCard from './BookCard';
import { useSearch } from '../contexts/SearchContext';

interface SearchResultsProps {
  books?: Book[];
  searchQuery?: string;
  isLoading?: boolean;
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  books: propBooks, 
  searchQuery: propSearchQuery, 
  isLoading: propIsLoading, 
  className = "" 
}) => {
  const { state, clearSearch } = useSearch();
  
  const books = propBooks ?? state.books;
  const searchQuery = propSearchQuery ?? state.query;
  const isLoading = propIsLoading ?? state.loading;
  if (isLoading) {
    return (
      <section className={`bg-white py-16 px-6 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-poppins">Buscando livros...</p>
          </div>
        </div>
      </section>
    );
  }

  if (books.length === 0 && searchQuery) {
    return (
      <section className={`bg-white py-16 px-6 ${className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 font-poppins">
            Nenhum livro encontrado
          </h2>
          <p className="text-gray-600 font-poppins">
            Não encontramos livros para "{searchQuery}". Tente uma busca diferente.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white py-16 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Reset Search Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              clearSearch();
              sessionStorage.removeItem('searchState');
              sessionStorage.removeItem('hasEverSearched');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-poppins font-semibold transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Nova Busca
          </button>
        </div>

        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 font-poppins">
            Resultados da busca
          </h2>
          {searchQuery && (
            <p className="text-gray-600 font-poppins">
              Encontramos {books.length} {books.length === 1 ? 'livro' : 'livros'} para "{searchQuery}"
            </p>
          )}
        </div>
        
        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
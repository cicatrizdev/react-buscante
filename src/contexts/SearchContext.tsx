import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types/Book';
import type { SearchState } from '../types/GoogleBooks';
import { searchBooks, transformGoogleBookToBook } from '../services/googleBooksApi';

interface SearchContextType {
  state: SearchState;
  searchBook: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchAction =
  | { type: 'SEARCH_START'; payload: string }
  | { type: 'SEARCH_SUCCESS'; payload: { books: Book[]; totalItems: number } }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'CLEAR_SEARCH' };

const initialState: SearchState = {
  books: [],
  loading: false,
  error: null,
  query: '',
  totalItems: 0,
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SEARCH_START':
      return {
        ...state,
        loading: true,
        error: null,
        query: action.payload,
      };
    case 'SEARCH_SUCCESS':
      return {
        ...state,
        loading: false,
        books: action.payload.books,
        totalItems: action.payload.totalItems,
        error: null,
      };
    case 'SEARCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        books: [],
        totalItems: 0,
      };
    case 'CLEAR_SEARCH':
      console.log('[SearchContext] CLEARING SEARCH - this should not happen during favorites!');
      return initialState;
    default:
      return state;
  }
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  // Verifica se há estado salvo no sessionStorage
  const savedState = sessionStorage.getItem('searchState');
  const initialStateWithSaved = savedState ? JSON.parse(savedState) : initialState;
  
  const [state, dispatch] = useReducer(searchReducer, initialStateWithSaved);

  // Salva o estado no sessionStorage sempre que mudar (exceto no estado inicial)
  useEffect(() => {
    if (state.query || state.books.length > 0) {
      sessionStorage.setItem('searchState', JSON.stringify(state));
      console.log('[SearchContext] State saved to sessionStorage:', state);
    }
  }, [state]);

  const searchBook = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    dispatch({ type: 'SEARCH_START', payload: query });

    try {
      const response = await searchBooks(query);
      const books = response.items?.map(transformGoogleBookToBook) || [];
      
      dispatch({
        type: 'SEARCH_SUCCESS',
        payload: {
          books,
          totalItems: response.totalItems,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SEARCH_ERROR',
        payload: error instanceof Error ? error.message : 'Falha ao buscar livros',
      });
    }
  };

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  return (
    <SearchContext.Provider value={{ state, searchBook, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch deve ser usado dentro de um SearchProvider');
  }
  return context;
};
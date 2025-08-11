import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types/Book';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/favoritesApi';
import { AsyncStateManager, executeWithState } from '../utils/asyncStateManager';

interface FavoritesState {
	favorites: Book[];
	loading: boolean;
	error: string | null;
}

interface FavoritesContextType {
	state: FavoritesState;
	addFavorite: (book: Book) => Promise<void>;
	removeFavorite: (bookId: string) => Promise<void>;
	isFavorite: (bookId: string) => boolean;
	refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

type FavoritesAction =
	| { type: 'FETCH_START' }
	| { type: 'FETCH_SUCCESS'; payload: Book[] }
	| { type: 'FETCH_ERROR'; payload: string }
	| { type: 'ADD_FAVORITE'; payload: Book }
	| { type: 'REMOVE_FAVORITE'; payload: string };

const initialState: FavoritesState = {
	favorites: [],
	loading: false,
	error: null,
};

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
	switch (action.type) {
		case 'FETCH_START':
			return {
				...state,
				loading: true,
				error: null,
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				favorites: action.payload,
				error: null,
			};
		case 'FETCH_ERROR':
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case 'ADD_FAVORITE':
			return {
				...state,
				favorites: [...state.favorites, action.payload],
			};
		case 'REMOVE_FAVORITE':
			return {
				...state,
				favorites: state.favorites.filter((book) => book.id !== action.payload),
			};
		default:
			return state;
	}
};

interface FavoritesProviderProps {
	children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
	const manager = useMemo(() => new AsyncStateManager(), []);

	const [state, dispatch] = useReducer(favoritesReducer, initialState);

	const refreshFavorites = useCallback(async () => {
		dispatch({ type: 'FETCH_START' });

		const favorites = await executeWithState(manager, 'refresh_favorites', getFavorites);
		if (favorites) {
			dispatch({ type: 'FETCH_SUCCESS', payload: favorites });
		}

		if (manager.getError('refresh_favorites')) {
			dispatch({
				type: 'FETCH_ERROR',
				payload: manager.getError('refresh_favorites') ?? 'Falha ao carregar favoritos',
			});
		}
	}, [dispatch, manager]);

	const addFavorite = async (book: Book) => {
		const isAlreadyFavorite = state.favorites.some((fav) => fav.id === book.id);
		if (isAlreadyFavorite) {
			console.log('[FavoritesContext] Book already favorite, skipping');
			return;
		}

		await executeWithState(manager, 'add_favorite', async () => addToFavorites(book));
		dispatch({ type: 'ADD_FAVORITE', payload: book });

		if (manager.getError('add_favorite')) {
			dispatch({
				type: 'FETCH_ERROR',
				payload: manager.getError('add_favorite') ?? 'Falha ao adicionar aos favoritos',
			});
		}
	};

	const removeFavorite = async (bookId: string) => {
		await executeWithState(manager, 'remove_favorite', async () => removeFromFavorites(bookId));
		dispatch({ type: 'REMOVE_FAVORITE', payload: bookId });

		if (manager.getError('remove_favorite')) {
			dispatch({
				type: 'FETCH_ERROR',
				payload: manager.getError('remove_favorite') ?? 'Falha ao remover dos favoritos',
			});
		}
	};

	const isFavorite = (bookId: string): boolean => {
		return state.favorites.some((book) => book.id === bookId);
	};

	useEffect(() => {
		refreshFavorites();
	}, [refreshFavorites]);

	return (
		<FavoritesContext.Provider
			value={{
				state,
				addFavorite,
				removeFavorite,
				isFavorite,
				refreshFavorites,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
	const context = useContext(FavoritesContext);
	if (context === undefined) {
		throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
	}
	return context;
};

import { useState, useCallback, useEffect } from 'react';
import type { Book } from '../types/Book';
import { getFavorites, addToFavorites, removeFromFavorites } from '../services/favoritesApi';

interface FavoritesState {
	favorites: Book[];
	loading: boolean;
	error: string | null;
}

export function useFavorites() {
	const [state, setState] = useState<FavoritesState>({
		favorites: [],
		loading: false,
		error: null,
	});
}

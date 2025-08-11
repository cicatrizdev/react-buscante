import type { Book } from '../types/Book';
import fetchWithTimeout from '../utils/fetchWithTimeout';

const FAVORITES_API_URL = 'http://localhost:3001/favorites';

export const getFavorites = async (): Promise<Book[]> => {
	try {
		const response = await fetchWithTimeout(async () => fetch(FAVORITES_API_URL));

		if (!response.ok) {
			throw new Error(`Falha ao buscar favoritos: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error('Error fetching favorites:', error);
		throw error;
	}
};

export const addToFavorites = async (book: Book): Promise<Book> => {
	try {
		const response = await fetchWithTimeout(async () =>
			fetch(FAVORITES_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(book),
			})
		);

		if (!response.ok) {
			throw new Error(`Falha ao adicionar aos favoritos: ${response.statusText}`);
		}

		return response.json();
	} catch (error) {
		console.error('Error adding to favorites:', error);
		throw error;
	}
};

export const removeFromFavorites = async (bookId: string): Promise<void> => {
	try {
		const response = await fetchWithTimeout(async () =>
			fetch(`${FAVORITES_API_URL}/${bookId}`, {
				method: 'DELETE',
			})
		);

		if (!response.ok) {
			throw new Error(`Falha ao remover dos favoritos: ${response.statusText}`);
		}
	} catch (error) {
		console.error('Error removing from favorites:', error);
		throw error;
	}
};

export const isFavorite = async (bookId: string): Promise<boolean> => {
	try {
		const favorites = await getFavorites();
		return favorites.some((book) => book.id === bookId);
	} catch (error) {
		console.error('Error checking if book is favorite:', error);
		return false;
	}
};

import type { Book } from '../types/Book';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import { favoritesAdapter } from '../utils/FavoritesAdapter';
import { cache } from '../utils/multilayerCache';
import { requestDeduplicator } from '../utils/requestDeduplicator';

const FAVORITES_API_URL = 'http://localhost:3001/favorites';

export const getFavorites = async (): Promise<Book[]> => {
	try {
		const cachedFavorites = cache.get<Book[]>('favorites');
		if (cachedFavorites) {
			console.log('[FavoritesApi] Retornando favoritos do cache');
			return cachedFavorites;
		}

		return await requestDeduplicator.dedupe('favorites', async () => {
			const response = await fetchWithTimeout(async () => fetch(FAVORITES_API_URL));

			if (!response.ok) {
				throw new Error(`Falha ao buscar favoritos: ${response.statusText}`);
			}

			const rawFavorites = await response.json();
			const favorites = favoritesAdapter.transformArray(rawFavorites);
			cache.set('favorites', favorites, { ttl: 300000, useStorage: true });
			return favorites;
		});
	} catch (error) {
		console.error('Error fetching favorites:', error);
		throw error;
	}
};

export const addToFavorites = async (book: Book): Promise<Book> => {
	try {
		return await requestDeduplicator.dedupe('add_favorite', async () => {
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

			const rawBook = await response.json();
			const newBook = favoritesAdapter.transform(rawBook);
			cache.set('favorites', [...(await getFavorites()), newBook], {
				ttl: 300000,
				useStorage: true,
			});
			return newBook;
		});
	} catch (error) {
		console.error('Error adding to favorites:', error);
		throw error;
	}
};

export const removeFromFavorites = async (bookId: string): Promise<void> => {
	try {
		return await requestDeduplicator.dedupe('remove_favorite', async () => {
			const response = await fetchWithTimeout(async () =>
				fetch(`${FAVORITES_API_URL}/${bookId}`, {
					method: 'DELETE',
				})
			);

			if (!response.ok) {
				throw new Error(`Falha ao remover dos favoritos: ${response.statusText}`);
			}

			cache.set(
				'favorites',
				(await getFavorites()).filter((book) => book.id !== bookId),
				{
					ttl: 300000,
					useStorage: true,
				}
			);
		});
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

import { getFavorites, isFavorite } from '../services/favoritesApi';
import { getBookById } from '../services/googleBooksApi';
import type { Book } from '../types/Book';

interface ComposedBookData extends Book {
	isFavorite: boolean;
	isAvailable: boolean;
	lastUpdated: number;
}

interface BookCache {
	[bookId: string]: {
		data: ComposedBookData;
		timestamp: number;
	};
}

class BookCompositionService {
	private cache: BookCache = {};
	private readonly CACHE_DURATION = 5 * 60 * 1000;

	private isCacheValid(bookId: string): boolean {
		const cached = this.cache[bookId];
		if (!cached) return false;

		const now = Date.now();
		return now - cached.timestamp < this.CACHE_DURATION;
	}

	private async checkFavoriteStatus(bookId: string): Promise<boolean> {
		try {
			return await isFavorite(bookId);
		} catch (error) {
			console.error('Erro ao verificar se o livro é favorito:', error);
			return false;
		}
	}

	private composedBookData(book: Book, isFavoriteStatus: boolean): ComposedBookData {
		return {
			...book,
			isFavorite: isFavoriteStatus,
			isAvailable: true,
			lastUpdated: Date.now(),
		};
	}

	async getComposedBookData(bookId: string): Promise<ComposedBookData | null> {
		if (this.isCacheValid(bookId)) {
			console.log(
				`[BookCompositionService] Cache válido para o livro ${bookId}, retornando dados em cache`
			);
			return this.cache[bookId]?.data || null;
		}

		try {
			const [book, favoriteStatus] = await Promise.allSettled([
				getBookById(bookId),
				this.checkFavoriteStatus(bookId),
			]);

			if (book.status === 'rejected' || !book.value) {
				console.log(`[BookCompositionService] Livro ${bookId} nao encontrado`);
				return null;
			}

			if (favoriteStatus.status === 'rejected') {
				console.log(`[BookCompositionService] Erro ao verificar se o livro ${bookId} é favorito`);
				return null;
			}

			const composedData = this.composedBookData(book.value, favoriteStatus.value);

			this.cache[bookId] = { data: composedData, timestamp: Date.now() };
			return composedData;
		} catch (error) {
			console.error('[BookCompositionService] Erro ao obter dados do livro:', error);
			return null;
		}
	}

	invalidateBook(bookId: string): void {
		delete this.cache[bookId];
	}

	clearCache(): void {
		this.cache = {};
	}

	updateFavoriteStatus(bookId: string, isFavoriteStatus: boolean): void {
		if (this.cache[bookId]) {
			this.cache[bookId].data.isFavorite = isFavoriteStatus;
			this.cache[bookId].timestamp = Date.now();
		}
	}

	async preloadBooks(books: Book[]): Promise<void> {
		const bookIds = books.map((book) => book.id).filter((id) => !this.isCacheValid(id));

		if (bookIds.length === 0) return;

		try {
			const favorites = await getFavorites();
			const favoriteIds = new Set(favorites.map((fav) => fav.id));

			books.forEach((book) => {
				if (!this.isCacheValid(book.id)) {
					const composedData = this.composedBookData(book, favoriteIds.has(book.id));
					this.cache[book.id] = { data: composedData, timestamp: Date.now() };
				}
			});
		} catch (error) {
			console.warn('[BookCompositionService] Erro ao precarregar livros:', error);
		}
	}
}

export const bookCompositionService = new BookCompositionService();

export const getComposedBookData = (bookId: string) =>
	bookCompositionService.getComposedBookData(bookId);

export const updateBookFavoriteStatus = (bookId: string, isFavoriteStatus: boolean) =>
	bookCompositionService.updateFavoriteStatus(bookId, isFavoriteStatus);

export const preloadBooksData = (books: Book[]) => bookCompositionService.preloadBooks(books);

export const invalidateBookCache = (bookId: string) =>
	bookCompositionService.invalidateBook(bookId);

export type { ComposedBookData };

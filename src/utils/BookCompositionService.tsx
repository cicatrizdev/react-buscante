import { isFavorite } from '../services/favoritesApi';
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
		if (!this.isCacheValid(bookId)) {
			console.log(`[BookCompositionService] Cache invalido para o livro ${bookId}, atualizando...`);
			return this.cache[bookId]?.data || null;
		}

		try {
			const [book, favoriteStatus] = await Promise.all([
				getBookById(bookId),
				this.checkFavoriteStatus(bookId),
			]);

			if (!book) {
				console.log(`[BookCompositionService] Livro ${bookId} nao encontrado`);
				return null;
			}

			const composedData = this.composedBookData(book, favoriteStatus);

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
}

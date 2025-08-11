import type { GoogleBooksResponse, GoogleBooksVolume } from '../types/GoogleBooks';
import type { Book } from '../types/Book';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import { googleBooksAdapter } from '../utils/GoogleBooksAdapter';
import { cache } from '../utils/multilayerCache';
import { requestDeduplicator } from '../utils/requestDeduplicator';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (
	query: string,
	maxResults: number = 20
): Promise<GoogleBooksResponse> => {
	if (!query.trim()) {
		return {
			kind: 'books#volumes',
			totalItems: 0,
			items: [],
		};
	}

	const url = new URL(GOOGLE_BOOKS_API_URL);
	url.searchParams.set('q', query);
	url.searchParams.set('maxResults', maxResults.toString());
	url.searchParams.set('printType', 'books');

	return await requestDeduplicator.dedupe('google_books_search', async () => {
		const response = await fetchWithTimeout(async () => fetch(url.toString()));

		if (!response.ok) {
			throw new Error(`Falha ao buscar livros: ${response.statusText}`);
		}

		const rawGoogleBooks = await response.json();
		return {
			kind: rawGoogleBooks.kind,
			totalItems: rawGoogleBooks.totalItems,
			items: googleBooksAdapter.transformArray(rawGoogleBooks.items),
		};
	});
};

export const getBookById = async (id: string): Promise<Book | null> => {
	try {
		const cachedBook = cache.get<Book>(`book_${id}`);
		if (cachedBook) {
			return cachedBook;
		}

		return await requestDeduplicator.dedupe('google_book_by_id', async () => {
			const response = await fetchWithTimeout(async () => fetch(`${GOOGLE_BOOKS_API_URL}/${id}`));

			if (!response.ok) {
				throw new Error(`Falha ao obter livro: ${response.statusText}`);
			}

			const googleBook: GoogleBooksVolume = await response.json();
			const book = googleBooksAdapter.transform(googleBook);
			cache.set(`book_${id}`, book, { ttl: 300000, useStorage: true });
			return book;
		});
	} catch (error) {
		console.error('Error fetching book by ID:', error);
		return null;
	}
};

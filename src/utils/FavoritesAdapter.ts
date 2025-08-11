import type { Book } from '../types/Book';
import { BaseAdapter } from './dataAdapter';
import { normalizeArray, normalizeNumber, normalizeString, normalizeUrl } from './normalize';

export class FavoritesAdapter extends BaseAdapter<Book, Book> {
	transform(favoriteBook: Book): Book {
		return {
			id: normalizeString(favoriteBook.id),
			title: normalizeString(favoriteBook.title),
			author: normalizeString(favoriteBook.author),
			publishedDate: normalizeString(favoriteBook.publishedDate),
			publisher: normalizeString(favoriteBook.publisher),
			pageCount: normalizeNumber(favoriteBook.pageCount),
			categories: normalizeArray(favoriteBook.categories),
			description: normalizeString(favoriteBook.description),
			thumbnail: normalizeUrl(favoriteBook.thumbnail),
			previewLink: normalizeUrl(favoriteBook.previewLink),
			infoLink: normalizeUrl(favoriteBook.infoLink),
		};
	}
}

export const favoritesAdapter = new FavoritesAdapter();

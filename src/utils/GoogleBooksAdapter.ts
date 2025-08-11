import type { Book } from '../types/Book';
import type { GoogleBooksVolume } from '../types/GoogleBooks';
import { BaseAdapter } from './dataAdapter';
import {
	joinArrayToString,
	normalizeArray,
	normalizeNumber,
	normalizeString,
	normalizeUrl,
} from './normalize';

export class GoogleBooksAdapter extends BaseAdapter<GoogleBooksVolume, Book> {
	transform(googleBook: GoogleBooksVolume): Book {
		const { id, volumeInfo } = googleBook;

		return {
			id: normalizeString(id),
			title: normalizeString(volumeInfo.title),
			author: joinArrayToString(volumeInfo.authors),
			publishedDate: normalizeString(volumeInfo.publishedDate),
			publisher: normalizeString(volumeInfo.publisher),
			pageCount: normalizeNumber(volumeInfo.pageCount),
			categories: normalizeArray(volumeInfo.categories),
			description: normalizeString(volumeInfo.description),
			thumbnail: normalizeUrl(volumeInfo.imageLinks?.thumbnail),
			previewLink: normalizeUrl(volumeInfo.previewLink),
			infoLink: normalizeUrl(volumeInfo.infoLink),
		};
	}
}

export const googleBooksAdapter = new GoogleBooksAdapter();

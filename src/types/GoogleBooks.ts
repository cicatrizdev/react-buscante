import type { Book } from './Book';

export interface GoogleBooksVolumeInfo {
	title: string;
	authors?: string[];
	publisher?: string;
	publishedDate?: string;
	description?: string;
	pageCount?: number;
	categories?: string[];
	imageLinks?: {
		thumbnail?: string;
		smallThumbnail?: string;
	};
	previewLink?: string;
	infoLink?: string;
}

export interface GoogleBooksVolume {
	id: string;
	volumeInfo: GoogleBooksVolumeInfo;
}

export interface GoogleBooksResponse {
	kind: string;
	totalItems: number;
	items?: Book[];
}

export interface SearchState {
	books: Book[];
	loading: boolean;
	error: string | null;
	query: string;
	totalItems: number;
}

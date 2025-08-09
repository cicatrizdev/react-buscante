import { useCallback, useEffect, useState } from 'react';
import {
	getComposedBookData,
	invalidateBookCache,
	updateBookFavoriteStatus,
	type ComposedBookData,
} from '../utils/BookCompositionService';
import { addToFavorites, removeFromFavorites } from '../services/favoritesApi';

interface UseBookDataReturn {
	book: ComposedBookData | null;
	isLoading: boolean;
	error: string | null;
	refreshBook: () => Promise<void>;
	toggleFavorite: () => Promise<void>;
}

export const useBookData = (bookId: string | undefined): UseBookDataReturn => {
	const [book, setBook] = useState<ComposedBookData | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBook = useCallback(async () => {
		if (!bookId) return;

		setIsLoading(true);
		setError(null);

		try {
			const composedBook = await getComposedBookData(bookId);
			if (composedBook) {
				setBook(composedBook);
			} else {
				setError('Livro não encontrado');
				setBook(null);
			}
		} catch (error) {
			console.error('[useBookData] Erro ao buscar livro:', error);
			setError('Não foi possível carregar os detalhes do livro');
			setBook(null);
		} finally {
			setIsLoading(false);
		}
	}, [bookId]);

	const refreshBook = useCallback(async () => {
		if (bookId) {
			invalidateBookCache(bookId);
			await fetchBook();
		}
	}, [bookId, fetchBook]);

	const toggleFavorite = useCallback(async () => {
		if (!book) return;

		try {
			const newFavoriteStatus = !book.isFavorite;
			setBook({ ...book, isFavorite: newFavoriteStatus });
			updateBookFavoriteStatus(book.id, newFavoriteStatus);

			if (newFavoriteStatus) {
				await addToFavorites(book);
			} else {
				await removeFromFavorites(book.id);
			}
		} catch (error) {
			console.error('[useBookData] Erro ao alternar favorito:', error);
			setBook((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
			updateBookFavoriteStatus(book.id, book.isFavorite);

			setError('Erro ao alternar favorito');

			setTimeout(() => setError(null), 3000);
		}
	}, [book]);

	useEffect(() => {
		fetchBook();
	}, [fetchBook]);

	return {
		book,
		isLoading,
		error,
		refreshBook,
		toggleFavorite,
	};
};

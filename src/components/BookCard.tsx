import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../types/Book';
import { useFavorites } from '../contexts/FavoritesContext';

interface BookCardProps {
	book: Book;
	className?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, className = '' }) => {
	const { addFavorite, removeFavorite, isFavorite } = useFavorites();
	const isBookFavorite = isFavorite(book.id);

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (isBookFavorite) {
			removeFavorite(book.id);
		} else {
			addFavorite(book);
		}
	};

	return (
		<div
			className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 relative ${className}`}
		>
			{/* Favorite Heart - Top Right */}
			<button
				onClick={handleToggleFavorite}
				className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${
					isBookFavorite
						? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
						: 'bg-white hover:bg-gray-50 text-gray-400 hover:text-red-500 border border-gray-200'
				}`}
				title={isBookFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
			>
				{isBookFavorite ? '♥' : '♡'}
			</button>

			{/* Book Cover */}
			<div className='flex justify-center mb-4'>
				<Link to={`/book/${book.id}`}>
					<img
						src={book.thumbnail || '/src/assets/not-available.png'}
						alt={`Capa do livro ${book.title}`}
						className='w-24 h-36 object-cover rounded shadow-sm hover:opacity-80 transition-opacity cursor-pointer'
					/>
				</Link>
			</div>

			{/* Book Info */}
			<div className='space-y-2'>
				{/* Title */}
				<Link to={`/book/${book.id}`}>
					<h3 className='font-semibold text-gray-900 text-sm line-clamp-2 font-poppins hover:text-blue-600 transition-colors cursor-pointer min-h-[2.5rem]'>
						{book.title}
					</h3>
				</Link>

				{/* Author */}
				<p className='text-xs text-gray-600 font-poppins'>por {book.author}</p>

				{/* Publication Info */}
				<div className='text-xs text-gray-500 space-y-1'>
					{book.publishedDate && <p>Publicado em {book.publishedDate}</p>}
					{book.publisher && <p>{book.publisher}</p>}
					{book.pageCount > 0 && <p>{book.pageCount} páginas</p>}
				</div>

				{/* Categories */}
				{book.categories.length > 0 && (
					<div className='flex flex-wrap gap-1'>
						{book.categories.slice(0, 2).map((category, index) => (
							<span
								key={index}
								className='inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-poppins'
							>
								{category}
							</span>
						))}
					</div>
				)}

				{/* Action Buttons */}
				<div className='flex gap-2 mt-4 pt-2'>
					<Link
						to={`/book/${book.id}`}
						className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2.5 px-3 rounded transition-colors font-poppins text-center font-medium'
					>
						Ver Detalhes
					</Link>
					{book.previewLink && (
						<a
							href={book.previewLink}
							target='_blank'
							rel='noopener noreferrer'
							className='flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2.5 px-3 rounded transition-colors font-poppins text-center font-medium'
						>
							Visualizar
						</a>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookCard;

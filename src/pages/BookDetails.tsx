import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById } from '../services/googleBooksApi';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Book } from '../types/Book';

const BookDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [book, setBook] = useState<Book | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { addFavorite, removeFavorite, isFavorite } = useFavorites();

	useEffect(() => {
		const fetchBook = async () => {
			if (!id) return;

			setIsLoading(true);
			setError(null);

			try {
				const foundBook = await getBookById(id);
				setBook(foundBook);
			} catch (err) {
				console.error('Erro ao buscar livro:', err);
				setError('Não foi possível carregar os detalhes do livro');
			} finally {
				setIsLoading(false);
			}
		};

		fetchBook();
	}, [id]);

	const handleToggleFavorite = () => {
		if (!book) return;

		const isBookFavorite = isFavorite(book.id);
		if (isBookFavorite) {
			removeFavorite(book.id);
		} else {
			addFavorite(book);
		}
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	if (isLoading) {
		return (
			<div className='max-w-7xl mx-auto px-6 py-12'>
				<div className='animate-pulse'>
					<div className='grid md:grid-cols-2 gap-12'>
						<div className='bg-gray-300 h-96 rounded-lg'></div>
						<div className='space-y-4'>
							<div className='h-8 bg-gray-300 rounded w-3/4'></div>
							<div className='h-6 bg-gray-300 rounded w-1/2'></div>
							<div className='h-4 bg-gray-300 rounded w-full'></div>
							<div className='h-4 bg-gray-300 rounded w-full'></div>
							<div className='h-4 bg-gray-300 rounded w-3/4'></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || (!book && !isLoading)) {
		return (
			<div className='max-w-7xl mx-auto px-6 py-12'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-900 mb-4 font-poppins'>
						Livro Não Encontrado
					</h1>
					<p className='text-gray-600 mb-6 font-poppins'>
						{error || 'O livro que você está procurando não existe ou pode ter sido removido.'}
					</p>
					<button
						onClick={handleGoBack}
						className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-medium'
					>
						Voltar
					</button>
				</div>
			</div>
		);
	}

	if (!book) {
		return null;
	}

	return (
		<div className='max-w-7xl mx-auto px-6 py-12'>
			{/* Back button */}
			<button
				onClick={handleGoBack}
				className='flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8 font-poppins'
			>
				<span className='mr-2'>←</span>
				Voltar aos resultados
			</button>

			<div className='grid md:grid-cols-2 gap-12'>
				{/* Book Image */}
				<div className='flex justify-center'>
					<div className='max-w-md'>
						<img
							src={book.thumbnail}
							alt={book.title}
							className='w-full h-auto rounded-lg shadow-lg'
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = '/src/assets/not-available.png';
							}}
						/>
					</div>
				</div>

				{/* Book Information */}
				<div className='space-y-6'>
					<div>
						<h1 className='text-4xl font-bold text-gray-900 mb-2 font-poppins'>{book.title}</h1>
						<p className='text-xl text-gray-600 mb-4 font-poppins'>por {book.author}</p>

						<div className='flex items-center space-x-4 mb-4'>
							<span className='text-gray-600 font-poppins'>{book.pageCount} páginas</span>
							<span className='text-gray-400'>|</span>
							<span className='text-gray-600 font-poppins'>{book.publishedDate}</span>
							<span className='text-gray-400'>|</span>
							<span className='text-gray-600 font-poppins'>{book.publisher}</span>
						</div>

						<div className='flex flex-wrap gap-2 mb-6'>
							{book.categories.map((category, index) => (
								<span
									key={index}
									className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-poppins'
								>
									{category}
								</span>
							))}
						</div>
					</div>

					<div>
						<h2 className='text-2xl font-semibold text-gray-900 mb-3 font-poppins'>Descrição</h2>
						<p className='text-gray-700 leading-relaxed font-poppins'>
							{book.description || 'Descrição não disponível.'}
						</p>
					</div>

					<div className='border-t pt-6'>
						<div className='flex items-center justify-between mb-6'>
							<button
								onClick={handleToggleFavorite}
								className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-poppins ${
									book && isFavorite(book.id)
										? 'bg-red-100 text-red-600 hover:bg-red-200'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
								}`}
							>
								<span>{book && isFavorite(book.id) ? '❤️' : '🤍'}</span>
								<span>
									{book && isFavorite(book.id)
										? 'Remover dos Favoritos'
										: 'Adicionar aos Favoritos'}
								</span>
							</button>
						</div>

						<div className='space-y-3'>
							{book.previewLink && (
								<a
									href={book.previewLink}
									target='_blank'
									rel='noopener noreferrer'
									className='block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-medium text-center'
								>
									Visualizar Livro
								</a>
							)}
							{book.infoLink && (
								<a
									href={book.infoLink}
									target='_blank'
									rel='noopener noreferrer'
									className='block w-full border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors font-poppins font-medium text-center'
								>
									Mais Informações
								</a>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Additional Information */}
			<div className='mt-16 border-t pt-8'>
				<h2 className='text-2xl font-semibold text-gray-900 mb-6 font-poppins'>
					Detalhes do Livro
				</h2>
				<div className='grid md:grid-cols-2 gap-8'>
					<div className='space-y-4'>
						<div className='flex justify-between'>
							<span className='font-medium text-gray-700 font-poppins'>Autor:</span>
							<span className='text-gray-600 font-poppins'>{book.author}</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium text-gray-700 font-poppins'>Páginas:</span>
							<span className='text-gray-600 font-poppins'>{book.pageCount}</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium text-gray-700 font-poppins'>Publicado:</span>
							<span className='text-gray-600 font-poppins'>{book.publishedDate}</span>
						</div>
					</div>
					<div className='space-y-4'>
						<div className='flex justify-between'>
							<span className='font-medium text-gray-700 font-poppins'>Editora:</span>
							<span className='text-gray-600 font-poppins'>{book.publisher}</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium text-gray-700 font-poppins'>Categorias:</span>
							<span className='text-gray-600 font-poppins'>
								{book.categories.join(', ') || 'Não especificadas'}
							</span>
						</div>
						<div className='flex justify-between'>
							<span className='font-medium text-gray-700 font-poppins'>Disponibilidade:</span>
							<span className='text-green-600 font-poppins'>Disponível</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookDetails;

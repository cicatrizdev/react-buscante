import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { useFavorites } from '../contexts/FavoritesContext';

type SortOption = 'recent' | 'title' | 'author' | 'publisher';

const Favorites: React.FC = () => {
	const { state } = useFavorites();
	const [sortBy, setSortBy] = useState<SortOption>('recent');

	const sortedFavorites = useMemo(() => {
		const favorites = [...state.favorites];

		switch (sortBy) {
			case 'title':
				return favorites.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
			case 'author':
				return favorites.sort((a, b) => {
					const authorA = a.author || '';
					const authorB = b.author || '';
					return authorA.localeCompare(authorB, 'pt-BR');
				});
			case 'publisher':
				return favorites.sort((a, b) => {
					const publisherA = a.publisher || '';
					const publisherB = b.publisher || '';
					return publisherA.localeCompare(publisherB, 'pt-BR');
				});
			case 'recent':
			default:
				return favorites.reverse(); // Mais recentes primeiro
		}
	}, [state.favorites, sortBy]);

	return (
		<div className='max-w-7xl mx-auto px-6 py-12'>
			<div className='mb-8'>
				<h1 className='text-4xl font-bold text-gray-900 mb-4 font-poppins'>Meus Favoritos</h1>
				<p className='text-xl text-gray-600 font-poppins'>Sua coleção de livros favoritos</p>
			</div>

			{state.loading ? (
				<div className='text-center py-16'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto'></div>
					<p className='mt-4 text-gray-600 font-poppins'>Carregando favoritos...</p>
				</div>
			) : state.error ? (
				<div className='text-center py-16'>
					<div className='max-w-md mx-auto'>
						<div className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
							<span className='text-4xl text-red-400'>⚠️</span>
						</div>
						<h2 className='text-2xl font-semibold text-gray-900 mb-4 font-poppins'>
							Erro ao carregar favoritos
						</h2>
						<p className='text-gray-600 mb-6 font-poppins'>{state.error}</p>
					</div>
				</div>
			) : state.favorites.length === 0 ? (
				<div className='text-center py-16'>
					<div className='max-w-md mx-auto'>
						<div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
							<span className='text-4xl text-gray-400'>❤️</span>
						</div>
						<h2 className='text-2xl font-semibold text-gray-900 mb-4 font-poppins'>
							Nenhum favorito ainda
						</h2>
						<p className='text-gray-600 mb-6 font-poppins'>
							Comece explorando nossa coleção de livros e adicione seus favoritos aqui.
						</p>
						<Link
							to='/'
							className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-medium inline-block'
						>
							Explorar Livros
						</Link>
					</div>
				</div>
			) : (
				<div>
					<div className='flex items-center justify-between mb-6'>
						<p className='text-gray-600 font-poppins'>
							{state.favorites.length} {state.favorites.length !== 1 ? 'livros' : 'livro'} nos seus
							favoritos
						</p>
						<div className='flex items-center space-x-4'>
							<label htmlFor='sort-select' className='text-gray-700 font-poppins font-medium'>
								Ordenar por:
							</label>
							<select
								id='sort-select'
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as SortOption)}
								className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-poppins bg-white'
							>
								<option value='recent'>Recém Adicionados</option>
								<option value='title'>Título A-Z</option>
								<option value='author'>Autor A-Z</option>
								<option value='publisher'>Editora A-Z</option>
							</select>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{sortedFavorites.map((book) => (
							<BookCard key={book.id} book={book} />
						))}
					</div>

					<div className='mt-12 text-center'>
						<h3 className='text-xl font-semibold text-gray-900 mb-4 font-poppins'>
							Procurando por mais livros?
						</h3>
						<p className='text-gray-600 mb-6 font-poppins'>
							Descubra novos livros para adicionar à sua coleção de favoritos.
						</p>
						<Link
							to='/'
							className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-poppins font-medium inline-block'
						>
							Explorar Mais Livros
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default Favorites;

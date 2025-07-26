import React from 'react';

const About: React.FC = () => {
	return (
		<div className='max-w-4xl mx-auto px-6 py-12'>
			<div className='text-center mb-12'>
				<h1 className='text-4xl font-bold text-gray-900 mb-4 font-poppins'>Sobre o Buscante</h1>
				<p className='text-xl text-gray-600 font-poppins'>
					Seu destino definitivo para descobrir livros incríveis
				</p>
			</div>

			<div className='grid md:grid-cols-2 gap-12 items-center'>
				<div className='space-y-6'>
					<h2 className='text-2xl font-semibold text-gray-900 font-poppins'>Nossa Missão</h2>
					<p className='text-gray-700 leading-relaxed font-poppins'>
						No Buscante, acreditamos que cada livro tem o poder de transformar vidas. Nossa missão é
						conectar leitores com os livros perfeitos que inspiram, educam e divertem.
					</p>

					<h2 className='text-2xl font-semibold text-gray-900 font-poppins'>O Que Oferecemos</h2>
					<ul className='space-y-3 text-gray-700 font-poppins'>
						<li className='flex items-start'>
							<span className='text-blue-500 mr-2'>•</span>
							Busca abrangente de livros em múltiplas categorias
						</li>
						<li className='flex items-start'>
							<span className='text-blue-500 mr-2'>•</span>
							Informações detalhadas e avaliações de livros
						</li>
						<li className='flex items-start'>
							<span className='text-blue-500 mr-2'>•</span>
							Recomendações personalizadas de leitura
						</li>
						<li className='flex items-start'>
							<span className='text-blue-500 mr-2'>•</span>
							Sistema de favoritos fácil de usar
						</li>
					</ul>
				</div>

				<div className='bg-gray-50 p-8 rounded-lg'>
					<h3 className='text-xl font-semibold text-gray-900 mb-4 font-poppins'>
						Por Que Escolher o Buscante?
					</h3>
					<div className='space-y-4'>
						<div className='flex items-center'>
							<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
								<span className='text-blue-600 text-xl'>📚</span>
							</div>
							<div>
								<h4 className='font-medium text-gray-900 font-poppins'>Vasta Coleção</h4>
								<p className='text-sm text-gray-600 font-poppins'>Acesso a milhares de livros</p>
							</div>
						</div>

						<div className='flex items-center'>
							<div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4'>
								<span className='text-green-600 text-xl'>⚡</span>
							</div>
							<div>
								<h4 className='font-medium text-gray-900 font-poppins'>Busca Rápida</h4>
								<p className='text-sm text-gray-600 font-poppins'>Encontre livros em segundos</p>
							</div>
						</div>

						<div className='flex items-center'>
							<div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4'>
								<span className='text-purple-600 text-xl'>❤️</span>
							</div>
							<div>
								<h4 className='font-medium text-gray-900 font-poppins'>Conteúdo Curado</h4>
								<p className='text-sm text-gray-600 font-poppins'>Recomendações de qualidade</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;

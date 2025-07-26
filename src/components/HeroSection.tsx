import React from 'react';
import SearchBar from './SearchBar';
import BookIllustration from './BookIllustration';

interface HeroSectionProps {
	onSearch?: (query: string) => void;
	className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, className = '' }) => {

	const handleSearch = (value: string) => {
		if (onSearch) {
			onSearch(value);
		}
	};

	return (
		<section
			className={`bg-gray-50 min-h-screen flex flex-col justify-center px-6 py-16 ${className}`}
		>
			<div className='max-w-7xl mx-auto w-full'>
				{/* Main heading - centralized */}
				<div className='text-center mb-16'>
					<h1 className='text-4xl lg:text-5xl font-bold font-poppins text-purple-600 mb-8 leading-tight'>
						Que livro você procura?
					</h1>

					{/* Search bar - centralized */}
					<div className='max-w-lg mx-auto'>
						<SearchBar
							placeholder='Busque por assunto, autoria, nome...'
							size='desktop'
							onSearch={onSearch ? handleSearch : undefined}
							className='w-full'
						/>
					</div>
				</div>

				{/* Content section - two columns */}
				<div className='grid lg:grid-cols-2 gap-16 items-center mt-20'>
					{/* Left side - Content text */}
					<div className='space-y-6 text-left'>
						<h2 className='text-3xl lg:text-4xl font-bold font-poppins text-slate-800 leading-relaxed'>
							Busque o livro
							<br />
							que quiser na
							<br />
							nossa estante!
						</h2>
					</div>

					{/* Right side - Book Illustration */}
					<div className='flex justify-center lg:justify-end'>
						<BookIllustration className='w-full max-w-lg transform hover:scale-105 transition-transform duration-300' />
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;

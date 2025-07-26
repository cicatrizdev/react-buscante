import React from 'react';
import illustration from '../assets/illustration.png';

interface BookIllustrationProps {
	className?: string;
}

const BookIllustration: React.FC<BookIllustrationProps> = ({ className = '' }) => {
	return (
		<div className={`relative ${className}`}>
			<img
				src={illustration}
				alt='Illustration of a person organizing books on shelves'
				className='w-full h-auto max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300'
			/>
		</div>
	);
};

export default BookIllustration;

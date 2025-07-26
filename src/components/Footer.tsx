import React from 'react';

interface FooterProps {
	className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className={`bg-slate-900 text-white py-6 px-6 ${className}`}>
			<div className='max-w-7xl mx-auto text-center'>
				<p className='text-sm font-poppins'>Copyright © Buscante {currentYear}</p>
			</div>
		</footer>
	);
};

export default Footer;

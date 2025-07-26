import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

interface HeaderProps {
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
	return (
		<header className={`bg-slate-900 text-white px-6 py-4 ${className}`}>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				{/* Logo */}
				<div className='flex items-center'>
					<Link to='/'>
						<img src={logo} alt='BUSCANTE' className='h-8 w-auto' />
					</Link>
				</div>

				{/* Navigation */}
				<nav className='hidden md:flex items-center space-x-8'>
					<Link
						to='/about'
						className='text-white hover:text-gray-300 transition-colors font-poppins'
					>
						Sobre
					</Link>
					<Link
						to='/contact'
						className='text-white hover:text-gray-300 transition-colors font-poppins'
					>
						Contato
					</Link>
					<Link
						to='/favorites'
						className='text-white hover:text-gray-300 transition-colors font-poppins'
					>
						Favoritos
					</Link>
				</nav>

				{/* Mobile menu button */}
				<button className='md:hidden text-white hover:text-gray-300 transition-colors'>
					<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M4 6h16M4 12h16M4 18h16'
						/>
					</svg>
				</button>
			</div>
		</header>
	);
};

export default Header;

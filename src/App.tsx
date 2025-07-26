import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import BookDetails from './pages/BookDetails';
import ScrollToTop from './components/ScrollToTop';
import { SearchProvider } from './contexts/SearchContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
	return (
		<SearchProvider>
			<FavoritesProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path='/' element={<Home />} />
							<Route path='/about' element={<About />} />
							<Route path='/contact' element={<Contact />} />
							<Route path='/favorites' element={<Favorites />} />
							<Route path='/book/:id' element={<BookDetails />} />
						</Routes>
						<ScrollToTop />
					</Layout>
				</Router>
			</FavoritesProvider>
		</SearchProvider>
	);
}

export default App;

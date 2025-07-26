import HeroSection from '../components/HeroSection';
import SearchResults from '../components/SearchResults';
import { useSearch } from '../contexts/SearchContext';

function Home() {
	const { state } = useSearch();
	
	// Simples: se tem busca ativa ou resultados, mostra SearchResults
	const showResults = state.query.length > 0 || state.books.length > 0 || state.loading;

	return <>{!showResults ? <HeroSection /> : <SearchResults />}</>;
}

export default Home;

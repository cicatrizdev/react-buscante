async function fetchWithTimeout<T>(
	fetcher: () => Promise<T>,
	timeout: number = 5000,
	retries: number = 2
): Promise<T> {
	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			return await Promise.race([
				fetcher(),
				new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
			]);
		} catch (error) {
			if (attempt === retries - 1) throw error;

			await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
		}
	}
	throw new Error('Falha ao buscar dados, máximas tentativas atingidas');
}

export default fetchWithTimeout;

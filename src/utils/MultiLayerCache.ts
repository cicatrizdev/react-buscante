interface CacheEntry<T = unknown> {
	data: T;
	timestamp: number;
	ttl: number;
	etag?: string;
}

class MultiLayerCache {
	// Cache em memória: Nivel 1
	private memoryCache = new Map<string, CacheEntry>();

	// Cache em storage: Nivel 2
	private storageCache = new Map<string, CacheEntry>();

	constructor() {
		this.loadFromStorage();
	}

	get<T>(key: string): T | null {
		// 1. Verifica o cache em memória
		const memoryEntry = this.memoryCache.get(key);
		if (memoryEntry && this.isValid(memoryEntry)) {
			return memoryEntry.data as T;
		}

		// 2. Verifica o cache em storage
		const storageEntry = this.storageCache.get(key);
		if (storageEntry && this.isValid(storageEntry)) {
			return storageEntry.data as T;
		}
		return null;
	}

	set<T>(
		key: string,
		data: T,
		options: {
			ttl?: number;
			useStorage?: boolean;
			etag?: string;
		} = {}
	): void {
		const { ttl = 300000, useStorage = false, etag } = options;

		const entry: CacheEntry<T> = {
			data,
			timestamp: Date.now(),
			ttl,
			etag,
		};

		this.memoryCache.set(key, entry);
		if (useStorage) {
			this.storageCache.set(key, entry);
			this.saveToStorage();
		}
	}

	private isValid(entry: CacheEntry): boolean {
		return Date.now() - entry.timestamp < entry.ttl;
	}

	clear(key?: string): void {
		if (key) {
			this.memoryCache.delete(key);
			this.storageCache.delete(key);
		} else {
			this.memoryCache.clear();
			this.storageCache.clear();
		}
		this.saveToStorage();
	}

	private saveToStorage(): void {
		try {
			const storageData = Object.fromEntries(this.storageCache.entries());
			localStorage.setItem('cache', JSON.stringify(storageData));
		} catch (error) {
			console.error('Erro ao salvar cache em storage:', error);
		}
	}

	private loadFromStorage(): void {
		try {
			const storedData = localStorage.getItem('cache');
			if (storedData) {
				const parsedData = JSON.parse(storedData);
				this.storageCache = new Map(Object.entries(parsedData));
			}
		} catch (error) {
			console.error('Erro ao carregar cache em storage:', error);
		}
	}
}

export const cache = new MultiLayerCache();

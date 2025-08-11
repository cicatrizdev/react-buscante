class RequestDeduplicator {
	private pendingRequests = new Map<string, Promise<unknown>>();

	async dedupe<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
		if (this.pendingRequests.has(key)) {
			return this.pendingRequests.get(key) as Promise<T>;
		}

		const promise = fetcher().finally(() => {
			this.pendingRequests.delete(key);
		});

		this.pendingRequests.set(key, promise);
		return promise;
	}

	cancel(key: string): void {
		this.pendingRequests.delete(key);
	}

	cancelAll(): void {
		this.pendingRequests.clear();
	}
}

export const requestDeduplicator = new RequestDeduplicator();

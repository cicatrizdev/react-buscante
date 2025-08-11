export interface AsyncState {
	loading: boolean;
	error: string | null;
}

export interface MultiLoadingState {
	[key: string]: boolean;
}

export interface MultiErrorState {
	[key: string]: string | null;
}

export class AsyncStateManager {
	private loadingStates: MultiLoadingState = {};
	private errorStates: MultiErrorState = {};

	setLoading(key: string, loading: boolean): void {
		this.loadingStates[key] = loading;
	}

	setError(key: string, error: string | null): void {
		this.errorStates[key] = error;
		if (error) this.setLoading(key, false);
	}

	isLoading(key: string): boolean {
		return this.loadingStates[key] ?? false;
	}

	getError(key: string): string | null {
		return this.errorStates[key] ?? null;
	}

	hasAnyLoading(): boolean {
		return Object.values(this.loadingStates).some((loading) => loading !== false);
	}

	hasAnyError(): boolean {
		return Object.values(this.errorStates).some((error) => error !== null);
	}

	clearError(key: string): void {
		this.errorStates[key] = null;
	}

	clearAllErrors(): void {
		this.errorStates = {};
	}

	getState(): { loading: MultiLoadingState; error: MultiErrorState } {
		return {
			loading: { ...this.loadingStates },
			error: { ...this.errorStates },
		};
	}
}

export async function executeWithState<T>(
	manager: AsyncStateManager,
	key: string,
	operation: () => Promise<T>
): Promise<T | null> {
	manager.setLoading(key, true);
	manager.clearError(key);

	try {
		const result = await operation();
		manager.setLoading(key, false);
		return result;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Erro desconhecido, operação falhou';
		manager.setError(key, errorMessage);
		return null;
	}
}

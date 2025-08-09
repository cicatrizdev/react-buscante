import { useState, useEffect } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.sessionStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Erro ao ler sessionStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(`Erro ao salvar sessionStorage key "${key}":`, error);
		}
	};

	const removeValue = () => {
		try {
			window.sessionStorage.removeItem(key);
			setStoredValue(initialValue);
		} catch (error) {
			console.error(`Erro ao remover sessionStorage key "${key}":`, error);
		}
	};

	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key) {
				try {
					setStoredValue(JSON.parse(e.newValue || 'null'));
				} catch (error) {
					console.error(`Erro ao atualizar sessionStorage key "${key}":`, error);
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => window.removeEventListener('storage', handleStorageChange);
	}, [key]);

	return [storedValue, setValue, removeValue] as const;
}

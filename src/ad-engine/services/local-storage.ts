import { Dictionary } from '../models';

export interface StorageEndpoint {
	getItem: (key: string) => string;
	setItem: (key: string, input: string) => void;
	removeItem: (key: string) => void;
	clear: () => void;
}

export class LocalStorage {
	private fallbackStorage: Dictionary = {};

	constructor(private storage: StorageEndpoint = window.localStorage) {}

	isAvailable(): boolean {
		try {
			this.storage.setItem('ae3-local-storage-test', '1');
			this.storage.getItem('ae3-local-storage-test');
			this.storage.removeItem('ae3-local-storage-test');
			return true;
		} catch (e) {
			return false;
		}
	}

	getItem<T>(key: string): T {
		try {
			let value = this.storage.getItem(key);
			try {
				value = JSON.parse(value);
			} catch {}
			return value as any;
		} catch (e) {
			return this.fallbackStorage[key];
		}
	}

	setItem(key: string, input: {} | string): boolean {
		const value: string = input instanceof Object ? JSON.stringify(input) : input;
		try {
			this.storage.setItem(key, value);
		} catch (e) {
			this.fallbackStorage[key] = value;
		}
		return true;
	}

	removeItem(key: string): void {
		try {
			return this.storage.removeItem(key);
		} catch (e) {
			delete this.fallbackStorage[key];
		}
	}

	clear(): void {
		try {
			this.storage.clear();
		} catch (e) {
			this.fallbackStorage = {};
		}
	}
}

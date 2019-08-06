import { Dictionary } from '../models';

export interface StorageProvider {
	getItem: (key: string) => string;
	setItem: (key: string, input: string) => void;
	removeItem: (key: string) => void;
	clear: () => void;
}

export class UniversalStorage {
	private fallbackStorage: Dictionary = {};

	constructor(private provider: StorageProvider = window.localStorage) {}

	isAvailable(): boolean {
		try {
			this.provider.setItem('ae3-provider-storage-test', '1');
			this.provider.getItem('ae3-provider-storage-test');
			this.provider.removeItem('ae3-provider-storage-test');
			return true;
		} catch (e) {
			return false;
		}
	}

	getItem<T>(key: string): T {
		try {
			let value = this.provider.getItem(key);
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
			this.provider.setItem(key, value);
		} catch (e) {
			this.fallbackStorage[key] = value;
		}
		return true;
	}

	removeItem(key: string): void {
		try {
			return this.provider.removeItem(key);
		} catch (e) {
			delete this.fallbackStorage[key];
		}
	}

	clear(): void {
		try {
			this.provider.clear();
		} catch (e) {
			this.fallbackStorage = {};
		}
	}
}

import { Dictionary } from '../models';
import { logger } from '../utils';

const logGroup = 'universal-storage';
export interface StorageProvider {
	getItem(key: string): string;
	setItem(key: string, input: string, timeToLiveMs?: number): void;
	removeItem(key: string): void;
	clear(): void;
}

export type StorageAdapter = () => StorageProvider;

export interface Storage<T> {
	getItem(key: string): T | string;
	setItem(key: string, input: Dictionary | string, timeToLiveMs?: number): boolean;
}

class InMemoryStorage implements StorageProvider {
	private storage: Dictionary = {};
	clear(): void {
		this.storage = {};
	}

	getItem(key: string): string {
		return this.storage[key];
	}

	removeItem(key: string): void {
		delete this.storage[key];
	}

	setItem(key: string, input: string): void {
		this.storage[key] = input;
	}
}
export class UniversalStorage implements Storage<any> {
	private fallbackStorage = new InMemoryStorage();
	private provider: StorageProvider;

	constructor(storageProvider: StorageAdapter = () => window.localStorage) {
		try {
			// Chrome throws error even during simple attempt to access local or session storage if they are disabled
			// So before setItem / removeItem test let's try setup provider first
			this.provider = storageProvider();
			// Next test storage
			// In case of local / session storage are not available it will throw error during setItem attempt
			if (!this.isAvailable()) {
				logger(logGroup, `StorageProvider doesn't work, fallback to the InMemoryProvider`);
				this.provider = this.fallbackStorage;
			}
		} catch {
			logger(logGroup, `StorageProvider doesn't work, fallback to the InMemoryProvider`);
			this.provider = this.fallbackStorage;
		}
	}

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

	getItem<T>(key: string): T | string {
		try {
			let value = this.provider.getItem(key);
			try {
				value = JSON.parse(value);
			} catch {
				return value;
			}
			return value as any;
		} catch (e) {
			return this.fallbackStorage.getItem(key);
		}
	}

	setItem(key: string, input: Dictionary | string, timeToLiveMs?: number): boolean {
		const value: string = input instanceof Object ? JSON.stringify(input) : input;
		try {
			this.provider.setItem(key, value, timeToLiveMs);
		} catch (e) {
			logger(logGroup, `Item ${key} wasn't set in the storage`, e);
			this.fallbackStorage.setItem(key, value);
		}
		return true;
	}

	removeItem(key: string): void {
		try {
			return this.provider.removeItem(key);
		} catch (e) {
			this.fallbackStorage.removeItem(key);
		}
	}

	clear(): void {
		try {
			this.provider.clear();
		} catch (e) {
			this.fallbackStorage.clear();
		}
	}
}

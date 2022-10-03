import { Dictionary } from '../models';

export interface StorageProvider {
	getItem(key: string): string;
	setItem(key: string, input: string, timeToLiveMs?: number): void;
	removeItem(key: string): void;
	clear(): void;
}

export interface Storage<T> {
	getItem(key: string): T | string;
	setItem(key: string, input: Dictionary | string, timeToLiveMs?: number): boolean;
}

export class UniversalStorage implements Storage<any> {
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
			return this.fallbackStorage[key];
		}
	}

	setItem(key: string, input: Dictionary | string, timeToLiveMs?: number): boolean {
		const value: string = input instanceof Object ? JSON.stringify(input) : input;
		try {
			this.provider.setItem(key, value, timeToLiveMs);
		} catch (e) {
			console.warn(`Item ${key} wasn't set in the storage`, e);
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

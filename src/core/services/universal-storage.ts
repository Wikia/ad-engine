import { Dictionary } from '../models';

export type StorageProvider = () => StorageAdapter;

export interface StorageAdapter {
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
	private storage: StorageAdapter;
	private fallbackStorage: Dictionary = {};

	constructor(provider: StorageProvider = () => window.localStorage) {
		try {
			// when LocalStorage is not available, an exception is thrown in Chrome
			this.storage = provider();
		} catch (e) {
			this.storage = {
				getItem: (key: string) => this.fallbackStorage[key],
				setItem: (key: string, value: Dictionary | string) => {
					this.fallbackStorage[key] = value;
				},
				removeItem: (key: string): void => {
					delete this.fallbackStorage[key];
				},
				clear: () => {
					this.fallbackStorage = {};
				},
			};
		}
	}

	isAvailable(): boolean {
		try {
			this.storage.setItem('ae3-provider-storage-test', '1');
			this.storage.removeItem('ae3-provider-storage-test');
			return true;
		} catch (e) {
			return false;
		}
	}

	getItem<T>(key: string): T | string {
		try {
			let value = this.storage.getItem(key);
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
			this.storage.setItem(key, value, timeToLiveMs);
		} catch (e) {
			console.warn(`Item ${key} wasn't set in the storage`, e);
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

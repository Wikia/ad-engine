import { Dictionary } from '../models';

export class LocalStorage {
	private fallbackStorage: Dictionary = {};

	isAvailable(): boolean {
		try {
			window.localStorage.setItem('ae3-local-storage-test', '1');
			window.localStorage.getItem('ae3-local-storage-test');
			window.localStorage.removeItem('ae3-local-storage-test');
			return true;
		} catch (e) {
			return false;
		}
	}

	getItem<T>(key: string): T {
		try {
			let value = window.localStorage.getItem(key);
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
			window.localStorage.setItem(key, value);
		} catch (e) {
			this.fallbackStorage[key] = value;
		}
		return true;
	}

	removeItem(key: string): void {
		try {
			return window.localStorage.removeItem(key);
		} catch (e) {
			delete this.fallbackStorage[key];
		}
	}

	clear(): void {
		try {
			window.localStorage.clear();
		} catch (e) {
			this.fallbackStorage = {};
		}
	}
}

class Storage {
	set(key: string, value: unknown): void {
		if (typeof value === 'string') {
			localStorage.setItem(key, value);
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}
	get(key: string) {
		try {
			return JSON.parse(localStorage.getItem(key));
		} catch (e) {
			return localStorage.getItem(key);
		}
	}
}

export const storage = new Storage();

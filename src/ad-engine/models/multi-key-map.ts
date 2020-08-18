export class MultiKeyMap<TKey, TValue> {
	private _values = new Map<TKey, TValue>();
	private _keys = new Map<TValue, Set<TKey>>();

	has(key: TKey): boolean {
		return this._values.has(key);
	}

	get(key: TKey): TValue | undefined {
		return this._values.get(key);
	}

	set(key: TKey, value: TValue): void {
		this.resetKey(key);
		this.setKey(value, key);
		this._values.set(key, value);
	}

	delete(key: TKey): void {
		const value = this._values.get(key);
		const keys = this.getKeys(value);

		keys.forEach((_key) => this._values.delete(_key));
		this._keys.delete(value);
	}

	clear(): void {
		this._values.clear();
		this._keys.clear();
	}

	values(): IterableIterator<TValue> {
		return this._keys.keys();
	}

	private getKeys(value: TValue): TKey[] {
		const keys = this._keys.get(value) || new Set<TKey>();

		return Array.from(keys);
	}

	private setKey(value: TValue, key: TKey): void {
		const keys = this._keys.get(value) || new Set<TKey>();

		keys.add(key);
		this._keys.set(value, keys);
	}

	private resetKey(key: TKey): void {
		const value = this._values.get(key);

		if (!value) {
			return;
		}

		this.removeKey(value, key);
	}

	private removeKey(value: TValue, key: TKey): void {
		const keys = this._keys.get(value) || new Set<TKey>();

		keys.delete(key);
		this._keys.set(value, keys);
	}
}

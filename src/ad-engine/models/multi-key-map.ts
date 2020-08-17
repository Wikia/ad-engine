export class MultiKeyMap<TKey, TValue> {
	private _values = new Map<TKey, TValue>();
	private _keys = new Map<TValue, TKey[]>();

	has(key: TKey): boolean {
		return this._values.has(key);
	}

	get(key: TKey): TValue | undefined {
		return this._values.get(key);
	}

	set(key: TKey, value: TValue): void {
		const keys = this.getKeys(value);

		keys.push(key);

		this._values.set(key, value);
		this.setKeys(value, keys);

		// console.log('\nvalues', Array.from(this._values.entries()));
		// console.log('keys', Array.from(this._keys.entries())); // need to reset stuff
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
		const keys = this._keys.get(value);

		if (!keys) {
			return [];
		}

		return keys;
	}

	private setKeys(value: TValue, keys: TKey[]): void {
		const _keys: TKey[] = Array.from(new Set(keys));

		this._keys.set(value, _keys);
	}
}

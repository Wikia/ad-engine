/**
 * @deprecated
 * Please use LazyQueue class instead
 */
export interface OldLazyQueue<T = any> {
	readonly length: number;
	start(): void;
	push(item: T): void;
}

/**
 * @deprecated
 * Please use LazyQueue class instead
 */
export function makeLazyQueue<T = any>(queue: T[], callback: (item: T) => void): void {
	if (typeof callback !== 'function') {
		throw new Error('LazyQueue used with callback not being a function');
	} else if (queue instanceof Array) {
		(queue as any).start = function () {
			while (queue.length > 0) {
				callback(queue.shift());
			}
			(queue as any).push = function (item) {
				callback(item);
			};
		};
	} else {
		throw new Error('LazyQueue requires an array as the first parameter');
	}
}

declare type LazyCallback<T> = (item: T) => void;
declare type PushCommand<T> = (...items: T[]) => void;

export class LazyQueue<T = any> {
	get length(): number {
		return this.items.length;
	}

	private itemFlushCallbacks: LazyCallback<T>[] = [];
	private pushCommand: PushCommand<T>;
	private items: T[] = [];

	constructor(...items: T[]) {
		this.items = [...items];
		this.setPreFlushPush();
	}

	flush(): void {
		while (this.items.length > 0) {
			this.emit(this.items.shift());
		}
		this.setPostFlushPush();
	}

	push(...items: T[]): void {
		this.pushCommand(...items);
	}

	onItemFlush(callback: LazyCallback<T>): void {
		if (typeof callback !== 'function') {
			throw new Error('onItemFlush used with callback not being a function');
		}
		this.itemFlushCallbacks.push(callback);
	}

	private setPreFlushPush(): void {
		this.pushCommand = (...items: T[]) => {
			this.items.push(...items);
		};
	}

	private setPostFlushPush(): void {
		this.pushCommand = (...items: T[]) => {
			items.forEach((item) => {
				this.emit(item);
			});
		};
	}

	private emit(item: T): void {
		this.itemFlushCallbacks.forEach((flushCallback) => {
			flushCallback(item);
		});
	}
}

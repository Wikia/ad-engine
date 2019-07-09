type MiddlewareNext<T> = (context: T) => Promise<void>;

export type Middleware<T> = (context: T, next?: MiddlewareNext<T>) => void | Promise<void>;

export class MiddlewareService<T> {
	private middlewares: Middleware<T>[] = [];

	add(middleware: Middleware<T>): this {
		this.middlewares.push(middleware);

		return this;
	}

	execute(context: any, final: Middleware<T>): void {
		this.next(context, [...this.middlewares, final]);
	}

	private async next(context: T, middlewares: Middleware<T>[]): Promise<void> {
		if (middlewares.length > 1) {
			await middlewares[0](context, (nextContext: T) =>
				this.next(nextContext, middlewares.slice(1)),
			);
		} else {
			middlewares[0](context, () => Promise.resolve());
		}
	}
}

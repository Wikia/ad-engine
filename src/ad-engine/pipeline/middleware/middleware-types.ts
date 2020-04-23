type MiddlewareNext<T> = (context: T) => Promise<void>;

export type Middleware<T> = (context: T, next?: MiddlewareNext<T>) => void | Promise<void>;

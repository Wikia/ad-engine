export interface Dictionary<T = any> {
	[key: string]: T;
}

export interface Type<T> extends Function {
	// tslint:disable-next-line:callable-types
	new (...args: any[]): T;
}

// tslint:disable-next-line:ban-types
export type TypeKey<T> = Type<T> | Function;

export type ValuesOf<T extends readonly any[]> = T[number];

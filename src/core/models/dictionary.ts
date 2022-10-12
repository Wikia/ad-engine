export interface Dictionary<T = any> {
	[key: string]: T;
}

export interface Type<T> extends Function {
	new (...args: any[]): T;
}

/*eslint @typescript-eslint/ban-types: "off"*/
export type TypeKey<T> = Type<T> | Function;

export type ValuesOf<T extends readonly any[]> = T[number];

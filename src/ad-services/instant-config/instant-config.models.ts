export type ConfigValue = boolean | string | string[] | number | number[] | object;

export interface Config {
	[key: string]: ConfigValue;
}

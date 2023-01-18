export type InstantConfigValue = boolean | string | string[] | number | number[] | object;

export interface InstantConfigResponse {
	[key: string]: InstantConfigValue | InstantConfigGroup[];
}

export interface InstantConfigSamplingCache {
	/**
	 * Floating point from 0 to 100.
	 * @default null
	 * @example 50.75
	 */
	sampling?: number;

	/**
	 * @default false
	 * @example true
	 */
	samplingCache?: boolean;
}

export interface InstantConfigGroup<T extends InstantConfigValue = InstantConfigValue>
	extends InstantConfigSamplingCache {
	/**
	 * Can be negated.
	 * @default *
	 * @example [ "non-Safari", "Chrome" ]
	 */
	browsers?: string[];

	/**
	 * String to match hostname.
	 * @default *
	 * @example [ "sandbox-adeng01" ]
	 */
	domains?: string[];

	/**
	 * Can be negated.
	 * @default *
	 * @example [ "desktop", "non-smartphone" ]
	 */
	devices?: string[];

	/**
	 * Can be negated.
	 * @default []
	 * @example [ "non-US", "PL-72", "XX-AF" ]
	 */
	regions?: string[];

	/**
	 * @default true
	 */
	value?: T;
}

export const negativePrefix = 'non-';
export const cacheSuffix = '-cached';
export const samplingSeparator = '/';

export type InstantConfigValue = boolean | string | string[] | number | number[] | object;

export interface InstantConfigResult {
	[key: string]: InstantConfigValue | InstantConfigGroup;
}

export interface InstantConfigGroup<T extends InstantConfigValue = InstantConfigValue> {
	/**
	 * Can be negated.
	 * @default *
	 * @example [ "non-Safari", "Chrome" ]
	 */
	browsers?: string[];

	/**
	 * Can be negated.
	 * @default []
	 * @example [ "non-US", "PL-72", "XX-AF" ]
	 */
	regions?: string[];

	/**
	 * Can be negated.
	 * @default *
	 * @example [ "desktop" ]
	 */
	devices?: string[];

	/**
	 * String to match domain.
	 * @default *
	 * @example [ "sandbox-adeng01" ]
	 */
	domains?: string[];

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

	value: T;
}

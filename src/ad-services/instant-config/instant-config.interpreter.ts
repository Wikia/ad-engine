import { Dictionary } from '@ad-engine/core';
import {
	InstantConfigGroup,
	InstantConfigResult,
	InstantConfigValue,
} from './instant-config.models';
import { BrowserMatcher } from './matchers/browser-matcher';
import { DeviceMatcher } from './matchers/device-matcher';
import { DomainMatcher } from './matchers/domain-matcher';
import { RegionMatcher } from './matchers/region-matcher';

export class InstantConfigInterpreter {
	private readonly browserMatcher = new BrowserMatcher();
	private readonly deviceMatcher = new DeviceMatcher();
	private readonly domainMatcher = new DomainMatcher();
	private readonly regionMatcher = new RegionMatcher();

	getValues(
		instantConfig: InstantConfigResult,
		instantGlobals: Dictionary = {},
	): Dictionary<InstantConfigValue> {
		const combined: Dictionary<InstantConfigValue> = { ...instantGlobals, ...instantConfig };

		return Object.keys(combined)
			.map((key) => ({ key, value: combined[key] }))
			.map(({ key, value }) => {
				if (key.startsWith('wgAdDriver')) {
					return { key, value };
				}
				return { key, value: this.getValue(key, value as InstantConfigGroup[]) };
			})
			.reduce((prev, curr) => ({ ...prev, [curr.key]: curr.value }), {});
	}

	private getValue(key: string, groups: InstantConfigGroup[]): InstantConfigValue {
		return { message: 'getValue', key, groups };
	}
}

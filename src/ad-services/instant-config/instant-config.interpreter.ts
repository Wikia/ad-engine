import { Dictionary } from '@ad-engine/core';
import {
	InstantConfigGroup,
	InstantConfigResponse,
	InstantConfigValue,
} from './instant-config.models';
import { BrowserMatcher } from './matchers/browser-matcher';
import { DeviceMatcher } from './matchers/device-matcher';
import { DomainMatcher } from './matchers/domain-matcher';
import { RegionMatcher } from './matchers/region-matcher';

export class InstantConfigInterpreter {
	constructor(
		private readonly browserMatcher = new BrowserMatcher(),
		private readonly deviceMatcher = new DeviceMatcher(),
		private readonly domainMatcher = new DomainMatcher(),
		private readonly regionMatcher = new RegionMatcher(),
	) {}

	getValues(
		instantConfig: InstantConfigResponse,
		instantGlobals: Dictionary<InstantConfigValue> = {},
	): Dictionary<InstantConfigValue> {
		const combined: InstantConfigResponse = {
			...instantGlobals,
			...instantConfig,
		};

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
		const correct = groups.find((group, index) => {
			return (
				this.browserMatcher.isValid(group.browsers) &&
				this.deviceMatcher.isValid(group.devices) &&
				this.domainMatcher.isValid(group.domains) &&
				this.regionMatcher.isValid(group, `${key}-${index}`)
			);
		});

		if (typeof correct !== 'undefined') {
			return typeof correct.value !== 'undefined' ? correct.value : true;
		}

		return undefined;
	}
}

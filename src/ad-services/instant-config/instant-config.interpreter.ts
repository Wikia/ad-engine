import { Dictionary, utils } from '@ad-engine/core';
import {
	InstantConfigGroup,
	InstantConfigResponse,
	InstantConfigValue,
} from './instant-config.models';
import { BrowserMatcher } from './matchers/browser-matcher';
import { DeviceMatcher } from './matchers/device-matcher';
import { DomainMatcher } from './matchers/domain-matcher';
import { RegionMatcher } from './matchers/region-matcher';
import { SamplingCacheManager } from './matchers/sampling-cache.manager';

const logGroup = 'instant-config-interpreter';

export class InstantConfigInterpreter {
	private configResponse: InstantConfigResponse = {};
	private readonly samplingCache = new SamplingCacheManager();

	constructor(
		private readonly browserMatcher = new BrowserMatcher(),
		private readonly deviceMatcher = new DeviceMatcher(),
		private readonly domainMatcher = new DomainMatcher(),
		private readonly regionMatcher = new RegionMatcher(),
	) {}

	init(
		instantConfig: InstantConfigResponse,
		instantGlobals: Dictionary<InstantConfigValue> = {},
	): this {
		this.configResponse = {
			...instantGlobals,
			...instantConfig,
		};

		return this;
	}

	getValues(): Dictionary<InstantConfigValue> {
		utils.logger(logGroup, 'get values called with', this.configResponse);

		return Object.keys(this.configResponse)
			.map((key) => ({ key, value: this.configResponse[key] }))
			.map(({ key, value }) => {
				if (key.startsWith('wg')) {
					return { key, value };
				}
				return { key, value: this.getValue(key, value as InstantConfigGroup[]) };
			})
			.reduce((prev, curr) => ({ ...prev, [curr.key]: curr.value }), {});
	}

	private getValue(key: string, groups: InstantConfigGroup[]): InstantConfigValue {
		const correct = groups.find((group, index) =>
			this.samplingCache.apply(`${key}-${index}`, group, this.getPredicate(group)),
		);

		if (typeof correct !== 'undefined') {
			return correct.value;
		}

		return undefined;
	}

	private getPredicate(group): () => boolean {
		return () =>
			this.browserMatcher.isValid(group.browsers) &&
			this.deviceMatcher.isValid(group.devices) &&
			this.domainMatcher.isValid(group.domains) &&
			this.regionMatcher.isValid(group.regions);
	}
}

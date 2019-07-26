import { utils } from '@ad-engine/core';
import { cacheSuffix, InstantConfigGroup, samplingSeparator } from '../instant-config.models';

// TODO: Move sampling and cache on top of the group. Make so that cache works per group.
// TODO: Key should be ${configName}-${groupIndex}
export class RegionMatcher {
	isProperRegion(config: InstantConfigGroup, key?: string): boolean {
		let validRegions: string[] = this.filterOutInvalidRegions(config.regions || []);

		if ('sampling' in config) {
			validRegions = this.applySampling(validRegions, config.sampling);

			if ('samplingCache' in config) {
				validRegions = this.applyCache(validRegions);
			}
		}

		return utils.geoService.isProperGeo(validRegions, key);
	}

	private filterOutInvalidRegions(regions: string[]): string[] {
		return regions
			.filter((region) => !region.includes(samplingSeparator))
			.filter((region) => !region.includes(cacheSuffix));
	}

	private applySampling(regions: string[], sampling: number): string[] {
		return regions.map((region) => `${region}${samplingSeparator}${sampling}`);
	}

	private applyCache(regions: string[]): string[] {
		return regions.map((region) => `${region}${cacheSuffix}`);
	}
}

import { utils } from '@ad-engine/core';
import { cacheSuffix, InstantConfigGroup, samplingSeparator } from '../instant-config.models';

export class RegionMatcher {
	isValid(regions: InstantConfigGroup['regions'] = []): boolean {
		// The ICBM does not send "regions" key, when regions get resolved on the backend.
		// In this case method isValid should return true.
		if (regions.length === 0) {
			return true;
		}

		const validRegions: string[] = this.filterOutInvalidRegions(regions);

		return utils.geoService.isProperGeo(validRegions);
	}

	private filterOutInvalidRegions(regions: string[]): string[] {
		return regions
			.filter((region) => !region.includes(samplingSeparator))
			.filter((region) => !region.includes(cacheSuffix));
	}
}

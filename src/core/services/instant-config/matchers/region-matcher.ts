import { cacheSuffix, InstantConfigGroup, samplingSeparator } from '../instant-config.models';
import { utils } from '../../../index';

export class RegionMatcher {
	isValid(regions: InstantConfigGroup['regions'] = []): boolean {
		const validRegions: string[] = this.filterOutInvalidRegions(regions);

		return utils.geoService.isProperGeo(validRegions);
	}

	private filterOutInvalidRegions(regions: string[]): string[] {
		return regions
			.filter((region) => !region.includes(samplingSeparator))
			.filter((region) => !region.includes(cacheSuffix));
	}
}

import { TargetingStrategyInterface } from '@wikia/platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/core';

export class MockedSiteLevelTags implements TargetingStrategyInterface {
	execute(): Partial<Targeting> {
		return {
			age: ['site_age'],
			bundles: ['site_bundles'],
			gnre: ['site_gnre'],
			media: ['site_media'],
			pform: ['site_pform'],
			pub: ['site_pub'],
			sex: ['site_sex'],
			theme: ['site_theme'],
			tv: ['site_tv'],
		};
	}
}

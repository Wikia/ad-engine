import { TargetingStrategyInterface } from '@wikia/platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/core';

export class MockedPageLevelTags implements TargetingStrategyInterface {
	execute(): Partial<Targeting> {
		return {
			age: ['page_age'],
			bundles: ['page_bundles'],
			gnre: ['page_gnre'],
			media: ['page_media'],
			pform: ['page_pform'],
			pub: ['page_pub'],
			sex: ['page_sex'],
			theme: ['page_theme'],
			tv: ['page_tv'],
		};
	}
}

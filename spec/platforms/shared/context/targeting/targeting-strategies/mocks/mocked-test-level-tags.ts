import { TargetingStrategyInterface } from '@wikia/platforms/shared/context/targeting/targeting-strategies/interfaces/targeting-strategy';
import { Targeting } from '@wikia/core';

export class MockedTestLevelTags implements TargetingStrategyInterface {
	execute(): Partial<Targeting> {
		return {
			age: ['test_age'],
			bundles: ['test_bundles'],
			gnre: ['test_gnre'],
			media: ['test_media'],
			pform: ['test_pform'],
			pub: ['test_pub'],
			sex: ['test_sex'],
			theme: ['test_theme'],
			tv: ['test_tv'],
		};
	}
}

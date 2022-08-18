import { utils } from '@wikia/ad-engine';

import { createFandomContext } from './create-fandom-context';
import { TargetingStrategyInterface, TargetingStrategy } from '../interfaces/targeting-strategy';
import { LegacyStrategy } from '../strategies/legacy-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { CombinedStrategy } from '../strategies/combined-strategy';

export function createSelectedStrategy(
	selectedStrategy: string,
	skin: string,
): TargetingStrategyInterface {
	switch (selectedStrategy) {
		case TargetingStrategy.PAGE_CONTEXT:
			return new PageContextStrategy(skin, createFandomContext());
		case TargetingStrategy.COMBINED:
			return new CombinedStrategy(skin, createFandomContext());
		case TargetingStrategy.SITE_CONTEXT:
		case TargetingStrategy.DEFAULT:
			return new LegacyStrategy(skin);
		default:
			utils.logger('Targeting', 'Unrecognized strategy, falling back to default');
			return new LegacyStrategy(skin);
	}
}

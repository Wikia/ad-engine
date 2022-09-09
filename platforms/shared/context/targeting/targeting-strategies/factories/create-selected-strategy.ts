import { utils } from '@wikia/ad-engine';

import { createFandomContext } from './create-fandom-context';
import { TargetingStrategyInterface, TargetingStrategy } from '../interfaces/targeting-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { CombinedStrategy } from '../strategies/combined-strategy';
import { SiteContextStrategy } from '../strategies/site-context-strategy';

export function createSelectedStrategy(
	selectedStrategy: string,
	skin: string,
): TargetingStrategyInterface {
	switch (selectedStrategy) {
		case TargetingStrategy.SITE_CONTEXT:
			return new SiteContextStrategy(skin, createFandomContext());
		case TargetingStrategy.PAGE_CONTEXT:
			return new PageContextStrategy(skin, createFandomContext());
		case TargetingStrategy.COMBINED:
		default:
			utils.logger('Targeting', 'Unrecognized strategy, falling back to default');
			return new CombinedStrategy(skin, createFandomContext());
	}
}

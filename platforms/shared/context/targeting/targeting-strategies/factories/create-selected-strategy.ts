import { utils } from '@wikia/ad-engine';

import { createFandomContext } from './create-fandom-context';
import { TargetingStrategy } from '../interfaces/targeting-strategy';
import { LegacyStrategy } from '../strategies/legacy-strategy';
import { PageContextStrategy } from '../strategies/page-context-strategy';
import { CombinedStrategy } from '../strategies/combined-strategy';

export enum TargetingStrategiesNames {
	DEFAULT = 'default',
	SITE_CONTEXT = 'siteContext',
	PAGE_CONTEXT = 'pageContext',
	COMBINED = 'combined',
}

export function createSelectedStrategy(selectedStrategy: string, skin: string): TargetingStrategy {
	switch (selectedStrategy) {
		case TargetingStrategiesNames.PAGE_CONTEXT:
			return new PageContextStrategy(skin, createFandomContext());
		case TargetingStrategiesNames.COMBINED:
			return new CombinedStrategy(skin, createFandomContext());
		case TargetingStrategiesNames.SITE_CONTEXT:
		case TargetingStrategiesNames.DEFAULT:
			return new LegacyStrategy(skin);
		default:
			utils.logger('Targeting', 'Unrecognized strategy, falling back to default');
			return new LegacyStrategy(skin);
	}
}

import { context, InstantConfigService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SlotSetupDefinition } from '../../../../shared';

@Injectable()
export class NewsAndRatingsSlotsDefinitionRepository {
	constructor(protected instantConfig: InstantConfigService) {}

	getInterstitialConfig(): SlotSetupDefinition {
		if (!this.isInterstitialApplicable()) {
			return;
		}

		const slotName = 'interstitial';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}

	private isInterstitialApplicable(): boolean {
		return this.instantConfig.get('icInterstitial') && context.get('state.isMobile');
	}
}
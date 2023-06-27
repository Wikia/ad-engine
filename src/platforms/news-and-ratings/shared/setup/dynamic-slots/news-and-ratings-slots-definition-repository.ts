import { Anyclip, context, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SlotSetupDefinition } from '../../../../shared';

const logGroup = 'dynamic-slots';

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

	getIncontentPlayerConfig(): SlotSetupDefinition | undefined {
		if (!Anyclip.isApplicable()) {
			utils.logger(logGroup, 'Aborting insertion of incontent_player');
			return;
		}

		const slotName = 'incontent_player';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: 'body',
				insertMethod: 'append',
				classList: ['hide', 'ad-slot'],
			},
			activator: () => {
				const { dataset } = document.getElementById(slotName);
				dataset.slotLoaded = 'true';
				dataset.ad = slotName;
				context.push('state.adStack', { id: slotName });
			},
		};
	}
}

import { Injectable } from '@wikia/dependency-injection';

import {
	communicationService,
	context,
	DomListener,
	eventsRepository,
	Nativo,
	nativoLazyLoader,
	UapLoadStatus,
} from '@wikia/ad-engine';
import { fanFeedNativeAdListener, SlotSetupDefinition } from '@platforms/shared';

@Injectable()
export class UcpMobileNativoSlotsDefinitionRepository {
	constructor(protected nativo: Nativo, protected domListener: DomListener) {
		this.nativo = new Nativo(context);
	}

	getNativoIncontentAdConfig(): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}
		const slotName = 'ntv_ad';

		return {
			slotCreatorConfig: {
				slotName: slotName,
				anchorSelector: '.mw-parser-output > h2:nth-of-type(4n)',
				insertMethod: 'before',
				classList: ['ntv-ad', 'ad-slot'],
			},
			activator: () => {
				const scrollThreshold = context.get('events.pushOnScroll.nativoThreshold') || 200;

				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) =>
						nativoLazyLoader.scrollTrigger(slotName, scrollThreshold, this.domListener, () => {
							if (!action.isLoaded || action.adProduct !== 'ruap') {
								context.push('state.adStack', { id: slotName });
							}
						}),
				);
			},
		};
	}

	getNativoFeedAdConfig(): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}
		const slotName = 'ntv_feed_ad';

		return {
			slotCreatorConfig: {
				slotName: slotName,
				anchorSelector: '.recirculation-prefooter',
				insertMethod: 'before',
				classList: ['ntv-ad', 'hide'],
			},
			activator: () => {
				fanFeedNativeAdListener(() => context.push('state.adStack', { id: slotName }));
			},
		};
	}
}

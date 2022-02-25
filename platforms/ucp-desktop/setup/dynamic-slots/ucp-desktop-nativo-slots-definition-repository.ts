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
export class UcpDesktopNativoSlotsDefinitionRepository {
	constructor(protected domListener: DomListener, protected nativo: Nativo) {
		this.nativo = new Nativo(context);
	}

	private onAdEngineUapLoaded(action: UapLoadStatus, slotName: string, scrollThreshold: number) {
		nativoLazyLoader.scrollTrigger(slotName, scrollThreshold, this.domListener, () =>
			this.nativo.scrollTriggerCallback(action, slotName),
		);
	}

	getNativoIncontentAdConfig(): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}
		const slotName = Nativo.INCONTENT_AD_SLOT_NAME;

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.mw-parser-output > h2:nth-of-type(2)',
				insertMethod: 'before',
				classList: ['ntv-ad', 'ad-slot'],
			},
			activator: () => {
				const scrollThreshold = context.get('events.pushOnScroll.nativoThreshold') || 200;

				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) => this.onAdEngineUapLoaded(action, slotName, scrollThreshold),
				);
			},
		};
	}

	getNativoFeedAdConfig(): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}
		const slotName = Nativo.FEED_AD_SLOT_NAME;

		return {
			activator: () => {
				fanFeedNativeAdListener(() => context.push('state.adStack', { id: slotName }));
			},
		};
	}
}

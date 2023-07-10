import { injectable } from 'tsyringe';

import {
	communicationService,
	context,
	DomListener,
	eventsRepository,
	Nativo,
	nativoLazyLoader,
	SlotCreatorConfig,
	UapLoadStatus,
} from '@wikia/ad-engine';

import { SlotSetupDefinition } from '../utils/insert-slots';
import { fanFeedNativeAdListener } from './fan-feed-native-ad-listener';

@injectable()
export class NativoSlotsDefinitionRepository {
	protected nativo: Nativo;

	constructor(protected domListener: DomListener) {
		this.nativo = new Nativo(context);
	}

	private onAdEngineUapLoaded(action: UapLoadStatus, slotName: string, scrollThreshold: number) {
		nativoLazyLoader.scrollTrigger(slotName, scrollThreshold, this.domListener, () =>
			this.nativo.scrollTriggerCallback(action, slotName),
		);
	}

	getNativoIncontentAdConfig(headerPosition: number): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}

		return {
			slotCreatorConfig: {
				slotName: Nativo.INCONTENT_AD_SLOT_NAME,
				anchorSelector: `.mw-parser-output > h2:nth-of-type(${headerPosition})`,
				insertMethod: 'before',
				classList: ['ntv-ad', 'ad-slot'],
			},
			activator: () => {
				const scrollThreshold = context.get('events.pushOnScroll.nativoThreshold');
				communicationService.on(
					eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
					(action: UapLoadStatus) =>
						this.onAdEngineUapLoaded(action, Nativo.INCONTENT_AD_SLOT_NAME, scrollThreshold),
				);
			},
		};
	}

	getNativoFeedAdConfig(slotCreatorConfig: SlotCreatorConfig | null = null): SlotSetupDefinition {
		if (!this.nativo.isEnabled()) {
			return;
		}

		return {
			slotCreatorConfig,
			activator: () => {
				fanFeedNativeAdListener((action: UapLoadStatus) => {
					this.nativo.scrollTriggerCallback(action, Nativo.FEED_AD_SLOT_NAME);
				});
			},
		};
	}
}

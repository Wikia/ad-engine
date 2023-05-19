import { insertSlots } from '@platforms/shared';
import {
	AdSlotEvent,
	AdSlotStatus,
	communicationService,
	context,
	DiProcess,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsSlotsDefinitionRepository } from './news-and-ratings-slots-definition-repository';

@Injectable()
export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();

		insertSlots([
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
		]);

		this.configureFloorAdhesionCodePriority();
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.mapped-ad,.ad');

		if (!adPlaceholders || adPlaceholders.length === 0) {
			console.warn('AdEngine did not find any ad placeholders');
			return;
		}

		adPlaceholders.forEach((placeholder: Element) => {
			const adSlotName = placeholder.getAttribute('data-ad-type');
			const adWrapper = utils.Document.getFirstElementChild(placeholder);

			if (!adWrapper || adSlotName === 'interstitial') {
				return;
			}

			adWrapper.id = adSlotName;

			if (this.isSlotLazyLoaded(adSlotName)) {
				context.push('events.pushOnScroll.ids', adSlotName);
			} else {
				context.push('state.adStack', { id: adSlotName });
			}
		});
	}

	private configureFloorAdhesionCodePriority(): void {
		const slotName = 'floor_adhesion';
		let porvataClosedActive = false;

		communicationService.onSlotEvent(
			AdSlotStatus.STATUS_SUCCESS,
			() => {
				porvataClosedActive = true;

				communicationService.onSlotEvent(AdSlotEvent.VIDEO_AD_IMPRESSION, () => {
					if (porvataClosedActive) {
						porvataClosedActive = false;
						slotService.disable(slotName);
					}
				});
			},
			slotName,
		);

		communicationService.onSlotEvent(
			AdSlotEvent.HIDDEN_EVENT,
			() => {
				porvataClosedActive = false;
			},
			slotName,
		);
	}

	private isSlotLazyLoaded(slotName: string): boolean {
		return context.get(`slots.${slotName}.lazyLoad`);
	}
}

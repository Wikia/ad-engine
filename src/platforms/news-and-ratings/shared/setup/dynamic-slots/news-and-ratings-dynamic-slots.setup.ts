import { context, DiProcess, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { insertSlots } from '../../../../shared';
import { NewsAndRatingsSlotsDefinitionRepository } from './news-and-ratings-slots-definition-repository';

@Injectable()
export class NewsAndRatingsDynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();

		insertSlots([this.slotsDefinitionRepository.getInterstitialConfig()]);
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

			if (!adWrapper) {
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

	private isSlotLazyLoaded(slotName: string): boolean {
		return context.get(`slots.${slotName}.lazyLoad`);
	}
}

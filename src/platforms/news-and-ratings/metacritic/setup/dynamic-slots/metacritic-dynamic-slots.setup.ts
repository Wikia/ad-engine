import { insertSlots } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsSlotsDefinitionRepository } from '../../../shared';

@Injectable()
export class MetacriticDynamicSlotsSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		this.injectSlots();

		insertSlots([this.slotsDefinitionRepository.getInterstitialConfig()]);
	}

	private injectSlots(): void {
		const adPlaceholders = document.querySelectorAll('.ad_unit');

		if (!adPlaceholders) {
			return;
		}

		adPlaceholders.forEach((placeholder) => {
			const adSlotName = placeholder.id;

			if (adSlotName) {
				context.push('state.adStack', { id: adSlotName });
			}
		});
	}
}

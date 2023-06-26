import { insertSlots } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsSlotsDefinitionRepository,
} from '../../../../shared';

@Injectable()
export class GamespotDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository,
		private dynamicSlotsSetup: NewsAndRatingsDynamicSlotsSetup,
	) {}

	private stubbedSlotsCounter = {};

	execute(): void {
		this.dynamicSlotsSetup.injectSlots('.mapped-ad,.ad', ['skybox', 'nav-ad-plus']);
		this.restoreStubbedSlots();

		insertSlots([
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
		]);
	}

	private restoreStubbedSlots(): void {
		const stubSlots = document.querySelectorAll('.stub-mpu');

		if (!stubSlots || stubSlots.length === 0) {
			return;
		}

		stubSlots.forEach((stub: Element) => {
			stub.insertAdjacentHTML('beforebegin', stub.innerHTML);
			const newSlotElement: HTMLElement = stub?.parentElement.querySelector('.mapped-ad');
			const baseSlotName = newSlotElement?.dataset['adType'];

			if (baseSlotName === 'interstitial') {
				return;
			}

			if (typeof this.stubbedSlotsCounter[baseSlotName] !== 'number') {
				this.stubbedSlotsCounter[baseSlotName] = 1;
				newSlotElement.id = baseSlotName;

				context.push('events.pushOnScroll.ids', baseSlotName);
			} else {
				this.stubbedSlotsCounter[baseSlotName]++;
				const newSlotName = `${baseSlotName}-${this.stubbedSlotsCounter[baseSlotName]}`;
				newSlotElement.id = newSlotName;

				this.updateSlotContext(baseSlotName, newSlotName);
				context.push('events.pushOnScroll.ids', newSlotName);
			}
		});
	}

	private updateSlotContext(baseSlotName: string, slotName: string) {
		context.set(`slots.${slotName}`, { ...context.get(`slots.${baseSlotName}`) });
		context.set(`slots.${slotName}.slotName`, slotName);
		context.set(`slots.${slotName}.targeting.pos`, slotName);
	}
}

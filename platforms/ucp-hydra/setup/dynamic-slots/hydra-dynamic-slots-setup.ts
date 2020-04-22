import { DynamicSlotsSetup } from '@platforms/shared';
import { context, Dictionary, SlotConfig, slotInjector } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector) {
				slotInjector.inject(slotName, true);
			}
		});
		this.injectBLB(slots['bottom_leaderboard'].insertAfterSelector);
	}

	private injectBLB(siblingsSelector): void {
		const wrapper = document.createElement('div');
		wrapper.id = 'btflb';

		const blbContainer = document.createElement('div');
		blbContainer.id = 'bottom_leaderboard';

		const siblingElement =
			document.querySelector('#siderail_ucpinternalgptestproject43') ||
			document.querySelector(siblingsSelector);

		if (siblingElement) {
			siblingElement.parentNode.insertBefore(wrapper, siblingElement.nextSibling);
			wrapper.appendChild(blbContainer);
		}
	}
}

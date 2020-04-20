import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import { context, Dictionary, SlotConfig, slotInjector } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
		slotsContext.addSlotSize('top_leaderboard', [2, 2]);
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertBeforeSelector) {
				slotInjector.inject(slotName, true);
			}
		});
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].insertAfterSelector) {
				this.injectAfter(slotName, slots[slotName].insertAfterSelector);
			}
		});
	}

	private injectAfter(slotName, siblingsSelector): void {
		const container = document.createElement('div');
		const siblingElement = document.querySelector(siblingsSelector);

		container.id = slotName;

		if (siblingElement) {
			siblingElement.parentNode.insertBefore(container, siblingElement.nextSibling);
		}
	}
}

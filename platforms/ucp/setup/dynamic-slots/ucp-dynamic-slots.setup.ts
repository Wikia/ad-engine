import { DynamicSlotsSetup } from '@platforms/shared';
import { context, Dictionary, insertNewSlot, SlotConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const slots: Dictionary<SlotConfig> = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].nextSiblingSelector) {
				insertNewSlot(slotName, document.querySelector(slots[slotName].nextSiblingSelector), true);
			}
		});
	}
}

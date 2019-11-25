import { DynamicSlotsSetup } from '@platforms/shared';
import { context, insertNewSlot, SlotConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const slots: { [key: string]: SlotConfig } = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].nextSiblingSelector) {
				insertNewSlot(slotName, document.querySelector(slots[slotName].nextSiblingSelector), true);
			}
		});
	}
}

import { DynamicSlotsSetup } from '@platforms/shared';
import { context, Dictionary, SlotConfig } from '@wikia/ad-engine';
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
				this.insertSlot(
					slotName,
					document.querySelector(slots[slotName].nextSiblingSelector),
					true,
				);
			}
		});
	}

	private insertSlot(
		slotName: string,
		nextSibling: HTMLElement,
		disablePushOnScroll: boolean,
	): HTMLElement {
		const container = document.createElement('div');

		container.id = slotName;

		nextSibling.parentNode.insertBefore(container, nextSibling);

		if (!disablePushOnScroll) {
			context.push('events.pushOnScroll.ids', slotName);
		}

		return container;
	}
}

import { DynamicSlotsSetup } from '@platforms/shared';
import {
	btRec,
	context,
	Dictionary,
	insertNewSlot,
	SlotConfig,
	SlotRotator,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	private appendRotatingSlot(
		slotName: string,
		slotNamePattern: string,
		parentContainer: HTMLElement,
	): void {
		const container = document.createElement('div');
		const prefix = slotNamePattern.replace(slotNamePattern.match(/({.*})/g)[0], '');
		const rotator = new SlotRotator(slotName, prefix, btRec);

		container.id = slotName;
		parentContainer.appendChild(container);
		rotator.rotateSlot();
	}

	private appendIncontentBoxad(slotConfig: SlotConfig): void {
		const isSupportedPageType = !!document.getElementById('recirculation-rail');

		if (isSupportedPageType) {
			this.appendRotatingSlot(
				'incontent_boxad_1',
				slotConfig.repeat.slotNamePattern,
				document.querySelector(slotConfig.parentContainerSelector),
			);
		}
	}
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
		this.appendIncontentBoxad(slots['incontent_boxad_1']);
	}
}

import { DynamicSlotsSetup } from '@platforms/shared';
import { btRec, context, FmrRotator, insertNewSlot, SlotConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	private static appendRotatingSlot(
		slotName: string,
		slotNamePattern: string,
		parentContainer: HTMLElement,
	): void {
		const container = document.createElement('div');
		const prefix = slotNamePattern.replace(slotNamePattern.match(/({.*})/g)[0], '');
		const rotator = new FmrRotator(slotName, prefix, btRec);

		container.id = slotName;
		parentContainer.appendChild(container);
		rotator.rotateSlot();
	}

	private static appendIncontentBoxad(slotConfig: SlotConfig): void {
		// TODO change to something like:
		// TODO const isSupportedPageType = 'article'.indexOf(context.get('wiki.targeting.pageType')) !== -1;
		// TODO when context fixed
		const isSupportedPageType = !!document.getElementById('recirculation-rail');

		if (isSupportedPageType) {
			UcpDynamicSlotsSetup.appendRotatingSlot(
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
		const slots: { [key: string]: SlotConfig } = context.get('slots');
		Object.keys(slots).forEach((slotName) => {
			if (slots[slotName].nextSiblingSelector) {
				insertNewSlot(slotName, document.querySelector(slots[slotName].nextSiblingSelector), true);
			}
		});
		UcpDynamicSlotsSetup.appendIncontentBoxad(slots['incontent_boxad_1']);
	}
}

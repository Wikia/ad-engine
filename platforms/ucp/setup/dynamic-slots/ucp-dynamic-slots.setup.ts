import { DynamicSlotsSetup } from '@platforms/shared';
import { context, insertNewSlot } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		this.injectSlots();
	}

	private injectSlots(): void {
		const slots = context.get('slots');
		Object.values(slots).forEach((slot) => {
			const { nextSibling, adProduct }: any = slot;
			if (nextSibling) {
				insertNewSlot(adProduct, document.querySelector(nextSibling), true);
			}
		});
	}
}

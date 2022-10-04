import { AdSlot, TEMPLATE, TemplateStateHandler, universalAdPackage } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyIcbDisabledHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
	}
}

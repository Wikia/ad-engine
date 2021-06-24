import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotPlaceholderSizeHandler implements TemplateStateHandler {
	constructor(private manager: UapDomManager, private reader: UapDomReader) {}

	async onEnter(): Promise<void> {
		const adSlotHeight = this.reader.getAdSlotHeight();

		if (adSlotHeight) {
			return this.manager.setAdSlotPlaceholderHeight(adSlotHeight);
		}

		return this.reader.readAdSlotHeight();
	}
}

import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotInitialYPositionHandler implements TemplateStateHandler {
	constructor(private reader: UapDomReader) {}

	async onEnter(): Promise<void> {
		this.reader.setAdSlotInitialYPos();
	}
}

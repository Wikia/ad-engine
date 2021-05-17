import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotPositionEmbeddedResolvedToStickyResolved implements TemplateStateHandler {
	constructor(private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.addClassToAdSlotPlaceholder('bfaa-sticky-resolved');
	}

	async onLeave(): Promise<void> {
		this.manager.removeAdSlotPlaceholderClass('bfaa-sticky-resolved');
	}
}

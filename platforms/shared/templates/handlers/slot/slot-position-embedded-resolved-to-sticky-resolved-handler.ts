import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotPositionEmbeddedResolvedToStickyResolvedHandler implements TemplateStateHandler {
	constructor(private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.addClassToAdSlotPlaceholder('bfaa-sticky-resolved');
	}
}

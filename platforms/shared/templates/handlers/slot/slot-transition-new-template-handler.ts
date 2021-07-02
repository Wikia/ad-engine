import { TemplateStateHandler, TemplateTransition, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotTransitionNewTemplateHandler implements TemplateStateHandler {
	constructor(private manager: UapDomManager) {}

	async onEnter(transition: TemplateTransition<'embeddedResolved'>): Promise<void> {
		this.manager.addClassToAdSlotPlaceholder('bfaa-transition');
		setTimeout(() => {
			transition('embeddedResolved');
		}, universalAdPackage.SLIDE_OUT_TIME);
	}
}

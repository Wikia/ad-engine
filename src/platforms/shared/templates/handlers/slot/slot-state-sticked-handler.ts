import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@injectable()
export class SlotStateStickedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.addClassToPage('uap-sticked');
		this.adSlot.addClass('uap-toc-pusher');
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotStateStickedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private manager: UapDomManager) {}

	async onEnter(): Promise<void> {
		this.manager.addClassToPage('uap-sticked');
		this.adSlot.addClass('uap-toc-pusher');
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

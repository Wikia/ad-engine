import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotStateStickedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private manager: UapDomManager) {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.manager.addClassToPage('uap-sticked');
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

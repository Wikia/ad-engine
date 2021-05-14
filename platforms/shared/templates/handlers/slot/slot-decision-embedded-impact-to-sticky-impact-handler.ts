import { DomListener, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedImpactToStickyImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private manager: UapDomManager, private domListener: DomListener) {}

	async onEnter(transition: TemplateTransition<'stickyImpact'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => window.scrollY >= this.manager.getAdSlotTopOffset() + 55),
				tap(() => {
					transition('stickyImpact');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

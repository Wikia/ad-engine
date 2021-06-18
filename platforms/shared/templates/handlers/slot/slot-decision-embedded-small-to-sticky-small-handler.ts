import { DomListener, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedSmallToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private manager: UapDomManager,
		private reader: UapDomReader,
		private domListener: DomListener,
	) {}

	async onEnter(transition: TemplateTransition<'stickySmall'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => this.reader.getAdSlotTopOffset() <= this.manager.getNavbarHeight()),
				tap(() => {
					transition('stickySmall');
					this.manager.setAdSlotTopOffset(window.scrollY);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

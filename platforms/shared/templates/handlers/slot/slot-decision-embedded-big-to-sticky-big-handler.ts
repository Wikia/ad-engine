import { DomListener, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedBigToStickyBigHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private reader: UapDomReader, private domListener: DomListener) {}

	async onEnter(transition: TemplateTransition<'stickyBig'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(
					() =>
						window.scrollY >=
						this.reader.getAdSlotInitialYPos() - this.reader.getNavbarOffsetHeight(),
				),
				tap(() => transition('stickyBig')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

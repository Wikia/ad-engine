import {
	AdSlot,
	DomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionEmbeddedSmallToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private reader: UapDomReader,
		private domListener: DomListener,
	) {}
	async onEnter(transition: TemplateTransition<'stickySmall'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(
					() =>
						window.scrollY >=
							this.reader.getAdSlotInitialYPos() - this.reader.getNavbarOffsetHeight() ||
						!utils.isInViewport(this.adSlot.getElement()),
				),
				tap(() => transition('stickySmall')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

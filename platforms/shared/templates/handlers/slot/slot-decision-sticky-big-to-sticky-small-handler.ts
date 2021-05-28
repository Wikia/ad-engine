import { DomListener, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { ScrollCorrector } from '../../helpers/scroll-corrector';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionStickyBigToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private domListener: DomListener,
		private scrollCorrector: ScrollCorrector,
		private reader: UapDomReader,
	) {}

	async onEnter(transition: TemplateTransition<'stickySmall'>): Promise<void> {
		const adSlotTopOffset = window.scrollY + this.reader.getNavbarHeight();

		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => this.reachedSmallSize(adSlotTopOffset)),
				tap(() => {
					const correction = this.scrollCorrector.usePositionCorrection();

					transition('stickySmall').then(correction);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedSmallSize(adSlotTopOffset: number): boolean {
		return this.reader.getProgressStickyBigToStickySmall(adSlotTopOffset) === 1;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

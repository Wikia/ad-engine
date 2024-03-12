import {
	AdSlot,
	DomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@ad-engine/core';
import { universalAdPackage } from '@wikia/ad-products';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ScrollCorrector } from '../../helpers/scroll-corrector';
import { StickinessTimeout } from '../../helpers/stickiness-timeout';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionImpactToResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private domListener: DomListener,
		private scrollCorrector: ScrollCorrector,
		private reader: UapDomReader,
		private timeout: StickinessTimeout,
	) {}

	async onEnter(transition: TemplateTransition<'sticky' | 'transition'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				withLatestFrom(this.timeout.isViewedAndDelayed()),
				filter(() => this.reachedResolvedSize()),
				tap(([, viewedAndDelayed]) => {
					const correction = this.scrollCorrector.usePositionCorrection();

					if (viewedAndDelayed) {
						this.adSlot.emitEvent(universalAdPackage.SLOT_STICKY_STATE_SKIPPED);
						transition('transition').then(correction);
					} else {
						transition('sticky').then(correction);
					}
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedResolvedSize(): boolean {
		return this.reader.getProgressImpactToResolved() === 1;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

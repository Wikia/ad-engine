import {
	AdSlot,
	DomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { ScrollCorrector } from '../../helpers/scroll-corrector';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionStickyToResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private domListener: DomListener,
		private scrollCorrector: ScrollCorrector,
		private reader: UapDomReader,
	) {}

	async onEnter(transition: TemplateTransition<'sticky'>): Promise<void> {
		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => this.reachedResolvedSize()),
				tap(() => {
					const correction = this.scrollCorrector.usePositionCorrection();

					this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);
					transition('sticky').then(correction);
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

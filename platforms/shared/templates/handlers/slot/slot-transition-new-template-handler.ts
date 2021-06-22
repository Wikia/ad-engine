import {
	AdSlot,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { ScrollCorrector } from '../../helpers/scroll-corrector';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotTransitionNewTemplateHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private scrollCorrector: ScrollCorrector,
		private manipulator: DomManipulator,
		private reader: UapDomReader,
	) {}

	async onEnter(transition: TemplateTransition<'embeddedResolved'>): Promise<void> {
		this.animate()
			.pipe(
				tap(() => {
					const correction = this.scrollCorrector.useScrollCorrection();

					transition('embeddedResolved').then(correction);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private animate(): Observable<unknown> {
		const duration = this.calcAnimationDuration();
		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('transition', `all ${duration}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`)
			.setProperty('marginTop', `-${this.reader.getSlotHeightResolved()}px`);

		return from(utils.wait(duration));
	}

	private calcAnimationDuration(): number {
		const heightResolved = this.reader.getSlotHeightResolved();
		const distance = this.reader.getNavbarOffsetResolvedToNone();
		const distanceFraction = (heightResolved - distance) / heightResolved;

		return distanceFraction * universalAdPackage.SLIDE_OUT_TIME;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

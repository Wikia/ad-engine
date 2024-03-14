import {
	AdSlot,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	uapConsts,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { ScrollCorrector } from '../../helpers/scroll-corrector';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotTransitionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private scrollCorrector: ScrollCorrector,
		private manipulator: DomManipulator,
		private reader: UapDomReader,
	) {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.animate()
			.pipe(
				tap(() => {
					const correction = this.scrollCorrector.useScrollCorrection();
					this.adSlot.removeClass('uap-toc-pusher');

					transition('resolved').then(correction);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private animate(): Observable<unknown> {
		const duration = uapConsts.SLIDE_OUT_TIME;

		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('transition', `top ${duration}ms ${uapConsts.CSS_TIMING_EASE_IN_CUBIC}`)
			.setProperty('top', `${this.reader.getSlotOffsetResolvedToNone()}px`);

		return from(utils.wait(duration));
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

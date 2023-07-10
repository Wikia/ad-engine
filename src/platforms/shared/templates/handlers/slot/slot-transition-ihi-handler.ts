import {
	AdSlot,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { inject, injectable } from 'tsyringe';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@injectable()
export class SlotTransitionIhiHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, private manipulator: DomManipulator) {}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.animate()
			.pipe(
				tap(() => {
					transition('hidden');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private animate(): Observable<unknown> {
		const height: number = this.adSlot.getElement().offsetHeight;
		const slideOutTime = 600;
		const fadeInTime = 400;
		const slotHideTime = 1000;

		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty(
				'transition',
				`bottom ${slideOutTime}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}, ` +
					`opacity ${fadeInTime}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`,
			)
			.setProperty('opacity', '0')
			.setProperty('bottom', `-${height}px`);

		return timer(slotHideTime);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

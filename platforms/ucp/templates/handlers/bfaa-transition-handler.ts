import {
	AdSlot,
	DomManipulator,
	NAVBAR,
	RxjsDomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, Observable, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { BfaaHelper } from '../helpers/bfaa-helper';

@Injectable()
export class BfaaTransitionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfaaHelper;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(NAVBAR) private navbar: HTMLElement,
		private domListener: RxjsDomListener,
	) {
		this.helper = new BfaaHelper(this.manipulator, this.params, this.adSlot, this.navbar);
	}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.adSlot.show();
		this.helper.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.helper.setResolvedAdHeight();
					this.helper.setAdFixedPosition();
					this.helper.setNavbarFixedPosition();
					this.helper.setBodyPadding();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();

		this.animate()
			.pipe(
				tap(() => {
					const correction = this.helper.useScrollCorrection();

					transition('resolved').then(correction);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private animate(): Observable<unknown> {
		const distance = this.calcAnimationDistance();
		const duration = this.calcAnimationDuration(distance);

		this.manipulator
			.element(this.navbar)
			.setProperty('transition', `top ${duration}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`)
			.setProperty('top', `${distance}px`);

		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty('transition', `top ${duration}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`)
			.setProperty('top', `${distance - this.helper.getResolvedAdHeight()}px`);

		return from(utils.wait(duration));
	}

	private calcAnimationDistance(): number {
		const distance = this.helper.getResolvedAdHeight() - window.scrollY;

		return distance <= 0 ? 0 : distance;
	}

	private calcAnimationDuration(distance: number): number {
		const distanceFraction =
			(this.helper.getResolvedAdHeight() - distance) / this.helper.getResolvedAdHeight();

		return distanceFraction * universalAdPackage.SLIDE_OUT_TIME;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}

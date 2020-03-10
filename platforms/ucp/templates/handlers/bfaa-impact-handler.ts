import {
	AdSlot,
	DomManipulator,
	FOOTER,
	NAVBAR,
	RxjsDomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, shareReplay, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { BfaaHelper } from '../helpers/bfaa-helper';

@Injectable()
export class BfaaImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfaaHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(FOOTER) private footer: HTMLElement,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: RxjsDomListener,
	) {
		this.helper = new BfaaHelper(this.manipulator, this.params, this.adSlot, navbar);
	}

	async onEnter(transition: TemplateTransition<'sticky' | 'resolved'>): Promise<void> {
		const isViewedAndDelayed$ = this.helper.isViewedAndDelayed().pipe(
			takeUntil(this.unsubscribe$),
			startWith(true),
			shareReplay(1),
		);
		isViewedAndDelayed$.subscribe();

		this.adSlot.show();
		this.helper.setImpactImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.helper.setImpactAdHeight();
					this.helper.setAdFixedPosition();
					this.helper.setNavbarFixedPosition();
					this.helper.setBodyPadding();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();

		this.domListener.scroll$
			.pipe(
				tap(() => {
					this.helper.setImpactAdHeight();
					this.helper.setAdFixedPosition();
					this.helper.setNavbarFixedPosition();
				}),
				filter(() => this.reachedResolvedSize()),
				withLatestFrom(isViewedAndDelayed$),
				tap(([_, shouldStick]) => {
					const correction = this.helper.usePositionCorrection(this.footer);

					if (shouldStick) {
						transition('sticky').then(correction);
					} else {
						transition('resolved').then(correction);
					}
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedResolvedSize(): boolean {
		return this.helper.getImpactAdHeight() <= this.helper.getResolvedAdHeight();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}

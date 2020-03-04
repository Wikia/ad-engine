import {
	AdSlot,
	DomManipulator,
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
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { isUndefined } from 'util';

@Injectable()
export class BfaaStickyDurationHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		private domListener: RxjsDomListener,
	) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.viewedAndDelayed()
			.pipe(
				takeUntil(this.unsubscribe$),
				switchMap(() => this.domListener.scroll$.pipe(take(1))),
				tap(() => {
					this.adSlot.emitEvent(universalAdPackage.SLOT_UNSTICKED_STATE);
					transition('transition');
				}),
			)
			.subscribe();
	}

	private viewedAndDelayed(): Observable<unknown> {
		const slotViewed: Promise<void> = this.adSlot.loaded.then(() => this.adSlot.viewed);

		return from(slotViewed.then(() => utils.wait(this.getAdditionalStickinessTime())));
	}

	private getAdditionalStickinessTime(): number {
		if (!isUndefined(this.params.stickyAdditionalTime)) {
			return this.params.stickyAdditionalTime;
		}

		return universalAdPackage.BFAA_UNSTICK_DELAY;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}

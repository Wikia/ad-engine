import {
	AdSlot,
	DomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { inject, injectable } from 'tsyringe';
import { StickinessTimeout } from '../../helpers/stickiness-timeout';

@injectable()
export class SlotDecisionTimeoutHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private domListener: DomListener,
		private timeout: StickinessTimeout,
	) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.timeout
			.isViewedAndDelayed()
			.pipe(
				filter((viewedAndDelayed: boolean) => viewedAndDelayed),
				switchMap(() => this.domListener.scroll$.pipe(take(1))),
				tap(() => {
					this.adSlot.emitEvent(universalAdPackage.SLOT_UNSTICKED_STATE);
					transition('transition');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

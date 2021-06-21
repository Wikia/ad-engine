import {
	AdSlot,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { StickinessTimeout } from '../../helpers/stickiness-timeout';

@Injectable({ autobind: false })
export class SlotDecisionTimeoutWithoutScrollHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private timeout: StickinessTimeout) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_FORCE_UNSTICK);

		this.timeout
			.isViewedAndDelayed()
			.pipe(
				filter((viewedAndDelayed) => viewedAndDelayed),
				tap(() => {
					this.adSlot.emitEvent(universalAdPackage.SLOT_FORCE_UNSTICK);
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

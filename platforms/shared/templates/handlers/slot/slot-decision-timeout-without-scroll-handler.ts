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

	async onEnter(transition: TemplateTransition<'embeddedResolved'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.timeout
			.isViewedAndDelayed()
			.pipe(
				filter((viewedAndDelayed) => viewedAndDelayed),
				tap(() => {
					this.adSlot.emitEvent(universalAdPackage.SLOT_UNSTICKED_STATE);
					transition('embeddedResolved');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

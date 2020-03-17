import {
	AdSlot,
	DomListener,
	NAVBAR,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { StickinessDelayer } from '../../helpers/stickiness-delayer';

@Injectable()
export class BfaaStickyDecisionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private delayer: StickinessDelayer;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
	) {
		this.delayer = new StickinessDelayer(this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.delayer
			.isViewedAndDelayed()
			.pipe(
				filter((viewedAndDelayed) => viewedAndDelayed),
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

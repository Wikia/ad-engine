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
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BfaaDelayHelper } from '../../helpers/bfaa-delay-helper';

@Injectable()
export class BfaaStickyDecisionHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private delayer: BfaaDelayHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
	) {
		this.delayer = new BfaaDelayHelper(this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.delayer
			.isViewedAndDelayed()
			.pipe(
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

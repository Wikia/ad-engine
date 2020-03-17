import {
	AdSlot,
	DomListener,
	NAVBAR,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { TimeoutManager } from '../helpers/timeout-manager';

@Injectable()
export class BfaaStickyDurationHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private timeoutManager: TimeoutManager,
	) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		if (this.timeoutManager.resolved) {
			transition('transition');
			return;
		}

		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.timeoutManager.resolved$
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

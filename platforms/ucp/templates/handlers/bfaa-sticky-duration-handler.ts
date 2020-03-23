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
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BfaaHelper } from '../helpers/bfaa-helper';

@Injectable()
export class BfaaStickyDurationHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfaaHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: RxjsDomListener,
	) {
		this.helper = new BfaaHelper(this.manipulator, this.params, this.adSlot, navbar);
	}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKED_STATE);

		this.helper
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
		this.manipulator.restore();
	}
}

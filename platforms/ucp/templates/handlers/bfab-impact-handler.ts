import {
	AdSlot,
	DomManipulator,
	NAVBAR,
	RxjsDomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { BfabHelper } from '../helpers/bfab-helper';

@Injectable()
export class BfabImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfabHelper;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: RxjsDomListener,
	) {
		this.helper = new BfabHelper(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {
		this.adSlot.show();
		this.helper.setImpactImage();
		this.helper.setImpactAdHeight();
		this.domListener.resize$
			.pipe(
				takeUntil(this.unsubscribe$),
				startWith({}),
				tap(() => {
					this.helper.setImpactAdHeight();
				}),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}

import {
	AdSlot,
	DomListener,
	DomManipulator,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { BfabHelper } from '../../helpers/bfab-helper';

@Injectable()
export class BfabResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manipulator = new DomManipulator();
	private helper: BfabHelper;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		private domListener: DomListener,
	) {
		this.helper = new BfabHelper(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(): Promise<void> {
		this.adSlot.show();
		this.helper.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.helper.setResolvedAdHeight();
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

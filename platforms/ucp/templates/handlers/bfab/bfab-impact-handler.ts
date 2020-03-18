import {
	AdSlot,
	DomListener,
	NAVBAR,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { BfabDomManager } from '../../helpers/bfab-dom-manager';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable()
export class BfabImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manager: BfabDomManager;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
	) {
		this.manager = new BfabDomManager(this.manipulator, this.params, this.adSlot);
	}

	async onEnter(): Promise<void> {
		this.adSlot.show();
		this.manager.setImpactImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setImpactAdHeight();
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

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
import { BfaaDomManager } from '../../helpers/bfaa-dom-manager';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable()
export class BfaaStickyHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private manager: BfaaDomManager;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) params: UapParams,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
	) {
		this.manager = new BfaaDomManager(this.manipulator, params, this.adSlot, navbar);
	}

	async onEnter(): Promise<void> {
		this.adSlot.show();
		this.manager.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setResolvedAdHeight();
					this.manager.setAdFixedPosition();
					this.manager.setNavbarFixedPosition();
					this.manager.setStickyBodyPadding();
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

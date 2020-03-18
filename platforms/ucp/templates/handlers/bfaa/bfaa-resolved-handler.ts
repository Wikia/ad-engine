import { AdSlot, DomListener, NAVBAR, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { BfaaDomManager } from '../../helpers/bfaa-dom-manager';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable()
export class BfaaResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
		private manager: BfaaDomManager,
	) {}

	async onEnter(): Promise<void> {
		this.adSlot.show();
		this.manager.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setResolvedAdHeight();
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

import { AdSlot, DomListener, NAVBAR, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { BfaaDomManager } from '../../helpers/bfaa-dom-manager';
import { BfaaDomReader } from '../../helpers/bfaa-dom-reader';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable()
export class BfaaImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
		private manager: BfaaDomManager,
		private reader: BfaaDomReader,
	) {}

	async onEnter(): Promise<void> {
		this.adSlot.show();
		this.manager.setImpactImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setDynamicImpactAdHeight();
					this.manager.setAdFixedPosition();
					this.manager.setNavbarFixedPosition();
					this.setImpactBodyPadding();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();

		this.domListener.scroll$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setDynamicImpactAdHeight();
					this.manager.setAdFixedPosition();
					this.manager.setNavbarFixedPosition();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private setImpactBodyPadding(): void {
		this.manipulator
			.element(document.body)
			.setProperty('paddingTop', `${this.reader.getImpactAdHeight() + this.navbar.offsetHeight}px`);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.manipulator.restore();
	}
}

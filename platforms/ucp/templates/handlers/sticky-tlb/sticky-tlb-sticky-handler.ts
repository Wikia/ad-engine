import { AdSlot, DomListener, NAVBAR, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomManager } from '../../helpers/uap-dom-manager';

@Injectable({ autobind: false })
export class StickyTlbStickyHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
		private manager: UapDomManager,
	) {}

	async onEnter(): Promise<void> {
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setAdFixedPosition();
					this.manager.setNavbarFixedPosition();
					this.setStickyBodyPadding();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private setStickyBodyPadding(): void {
		const adAndNavHeight = this.adSlot.element.offsetHeight + this.navbar.offsetHeight;

		this.manipulator.element(document.body).setProperty('paddingTop', `${adAndNavHeight}px`);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

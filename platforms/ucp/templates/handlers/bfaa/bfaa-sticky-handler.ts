import { DomListener, NAVBAR, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class BfaaStickyHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(NAVBAR) private navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
		private manager: UapDomManager,
		private reader: UapDomReader,
	) {}

	async onEnter(): Promise<void> {
		this.manager.setResolvedImage();
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setResolvedAdHeight();
					this.manager.setAdFixedPosition();
					this.manager.setNavbarFixedPosition();
					this.setStickyBodyPadding();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private setStickyBodyPadding(): void {
		const adHeight = this.reader.getResolvedAdHeight();
		const adAndNavHeight = adHeight + this.navbar.offsetHeight;

		this.manipulator.element(document.body).setProperty('paddingTop', `${adAndNavHeight}px`);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

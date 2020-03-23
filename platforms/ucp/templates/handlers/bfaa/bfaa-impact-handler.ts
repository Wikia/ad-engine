import { DomListener, NAVBAR, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class BfaaImpactHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(NAVBAR) private navbar: HTMLElement,
		private domListener: DomListener,
		private manipulator: DomManipulator,
		private manager: UapDomManager,
		private reader: UapDomReader,
	) {}

	async onEnter(): Promise<void> {
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
	}
}

import { AdSlot, DomListener, NAVBAR, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotResolvedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(NAVBAR) private navbar: HTMLElement,
		private domListener: DomListener,
		private manager: UapDomManager,
		private reader: UapDomReader,
		private manipulator: DomManipulator,
	) {}

	async onEnter(): Promise<void> {
		this.manager.setResolvedImage();

		merge(this.domListener.scroll$, this.domListener.resize$)
			.pipe(
				startWith({}),
				tap(() => {
					this.manager.setResolvedAdHeight();

					const distance = this.calcAnimationDistance();

					this.manipulator.element(this.navbar).setProperty('top', `${distance}px`);

					this.manipulator
						.element(this.adSlot.getElement())
						.setProperty('top', `${distance - this.reader.getResolvedAdHeight()}px`);

					this.manipulator
						.element(document.body)
						.setProperty(
							'paddingTop',
							`${this.reader.getResolvedAdHeight() + this.navbar.offsetHeight}px`,
						);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private calcAnimationDistance(): number {
		const distance = this.reader.getResolvedAdHeight() - window.scrollY;

		return distance <= 0 ? 0 : distance;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

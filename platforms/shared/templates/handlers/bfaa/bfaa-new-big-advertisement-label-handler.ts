import { AdSlot, DomListener, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable({ autobind: false })
export class BfaaBigAdvertisementLabelHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private domListener: DomListener,
		private manipulator: DomManipulator,
	) {}

	async onEnter(): Promise<void> {
		this.domListener.resize$
			.pipe(
				startWith({}),
				tap(() => {
					this.setBigAdvertisementLabel();
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	setBigAdvertisementLabel(): void {
		this.manipulator.element(this.adSlot.getElement()).addClass('big-advertisement-label');
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

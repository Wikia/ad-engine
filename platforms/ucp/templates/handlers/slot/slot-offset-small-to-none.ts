import { AdSlot, DomListener, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotOffsetSmallToNone implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private domListener: DomListener,
		private reader: UapDomReader,
		private manipulator: DomManipulator,
	) {}

	async onEnter(): Promise<void> {
		merge(this.domListener.scroll$, this.domListener.resize$)
			.pipe(
				startWith({}),
				tap(() => {
					this.manipulator
						.element(this.adSlot.getElement())
						.setProperty('top', `${this.reader.getSlotOffsetSmallToNone()}px`);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

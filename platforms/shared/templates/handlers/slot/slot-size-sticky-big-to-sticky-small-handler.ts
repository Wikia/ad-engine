import { DomListener, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotSizeStickyBigToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private domListener: DomListener,
		private manager: UapDomManager,
		private reader: UapDomReader,
	) {}

	async onEnter(): Promise<void> {
		const adSlotTopOffset = window.scrollY + this.reader.getNavbarHeight();

		this.manager.setImpactImage();
		merge(this.domListener.resize$, this.domListener.scroll$)
			.pipe(
				startWith({}),
				tap(() => this.manager.setSlotHeightBigToSmall(adSlotTopOffset)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

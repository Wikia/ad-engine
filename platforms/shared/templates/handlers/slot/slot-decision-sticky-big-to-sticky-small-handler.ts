import { DomListener, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { UapDomManager } from '../../helpers/uap-dom-manager';
import { UapDomReader } from '../../helpers/uap-dom-reader';

@Injectable({ autobind: false })
export class SlotDecisionStickyBigToStickySmallHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private domListener: DomListener,
		private manager: UapDomManager,
		private reader: UapDomReader,
	) {}

	async onEnter(transition: TemplateTransition<'stickySmall'>): Promise<void> {
		const adSlotPlaceholderTopOffset = this.manager.getAdSlotPlaceholderTopOffset();

		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => this.reachedSmallSize(adSlotPlaceholderTopOffset)),
				tap(() => transition('stickySmall')),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private reachedSmallSize(adSlotPlaceholderTopOffset: number): boolean {
		return this.reader.getProgressStickyBigToStickySmall(adSlotPlaceholderTopOffset) === 1;
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

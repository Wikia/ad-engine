import {
	AdSlot,
	context,
	DomListener,
	slotImpactWatcher,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '@platforms/shared';

@Injectable({ autobind: false })
export class SlotStateIncontentStickedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private domListener: DomListener,
		private manipulator: DomManipulator,
	) {}

	async onEnter(transition: TemplateTransition<'waiting' | 'done'>): Promise<void> {
		const slotBreakPosition =
			utils.getTopOffset(this.adSlot.element) - context.get('templates.stickyIcb.topPadding');

		slotImpactWatcher.request({ id: this.adSlot.getSlotName(), priority: 5 });
		this.manipulator.element(this.adSlot.element).addClass('incontent-sticked');

		from(this.adSlot.viewed)
			.pipe(
				tap(() => {
					transition('done');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();

		merge(this.domListener.resize$, this.domListener.scroll$)
			.pipe(
				startWith({}),
				tap(() => {
					if (this.adSlot.slotViewed) {
						transition('done');
					}

					if (window.scrollY < slotBreakPosition) {
						transition('waiting');
					}
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		slotImpactWatcher.disable([this.adSlot.getSlotName()]);
		this.unsubscribe$.next();
	}
}

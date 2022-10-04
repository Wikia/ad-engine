import {
	AdSlot,
	context,
	DomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { from, merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class SlotStateWaitingToIncontentStickyHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private domListener: DomListener) {}

	async onEnter(transition: TemplateTransition<'sticky' | 'done'>): Promise<void> {
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

					if (context.get('templates.stickyIcb.stickedSlot')) {
						return;
					}

					if (
						utils.getTopOffset(this.adSlot.element) -
							context.get('templates.stickyIcb.topPadding') <
						window.scrollY
					) {
						transition('sticky');
					}
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}

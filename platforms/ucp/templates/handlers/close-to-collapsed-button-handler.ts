import {
	AdSlot,
	CloseButton,
	DomListener,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { filter, startWith, take, takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class CloseToCollapsedButtonHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private button: HTMLButtonElement;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private domListener: DomListener) {}

	async onEnter(transition: TemplateTransition<'collapsed'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(universalAdPackage.SLOT_FORCE_UNSTICK);
				transition('collapsed');
			},
		}).render();

		this.domListener.scroll$
			.pipe(
				startWith({}),
				filter(() => {
					return window.scrollY > 0;
				}),
				take(1),
				tap(() => {
					this.adSlot.getElement().appendChild(this.button);
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.button.remove();
	}
}

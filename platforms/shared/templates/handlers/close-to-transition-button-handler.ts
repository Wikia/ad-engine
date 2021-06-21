import {
	AdSlot,
	CloseButton,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CloseButtonHelper } from '../helpers/close-button-helper';

@Injectable({ autobind: false })
export class CloseToTransitionButtonHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private button: HTMLButtonElement;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private helper: CloseButtonHelper) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(universalAdPackage.SLOT_FORCE_UNSTICK);
				transition('transition');
			},
		}).render();

		this.helper
			.appendOnScroll(this.button)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.button.remove();
	}
}

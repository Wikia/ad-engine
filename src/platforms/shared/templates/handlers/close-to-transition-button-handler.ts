import {
	AdSlot,
	CloseButton,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { inject, injectable } from 'tsyringe';
import { CloseButtonHelper } from '../helpers/close-button-helper';

@injectable()
export class CloseToTransitionButtonHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private button: HTMLButtonElement;

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, private helper: CloseButtonHelper) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(universalAdPackage.SLOT_FORCE_UNSTICK);
				transition('transition');
			},
		}).render();

		this.helper.appendOnScroll(this.button).pipe(takeUntil(this.unsubscribe$)).subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.button.remove();
	}
}

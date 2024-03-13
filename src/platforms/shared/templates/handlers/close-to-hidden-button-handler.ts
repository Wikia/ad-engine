import {
	AdSlot,
	CloseButton,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CloseButtonHelper } from '../helpers/close-button-helper';

@Injectable({ autobind: false })
export class CloseToHiddenButtonHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();
	private button: HTMLButtonElement;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private helper: CloseButtonHelper) {}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				// This was previously a variable set in the uap package.
				this.adSlot.emitEvent('force-unstick');
				transition('hidden');
			},
		}).render();

		this.helper.appendOnScroll(this.button).pipe(takeUntil(this.unsubscribe$)).subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
		this.button.remove();
	}
}

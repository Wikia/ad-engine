import {
	AdSlot,
	CloseButton,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class CloseToRedirectButtonHandler implements TemplateStateHandler {
	private button: HTMLButtonElement;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				window.location.replace(this.adSlot.element.getAttribute('redirect-url'));
			},
		}).render();

		this.adSlot.getElement().appendChild(this.button);

		window.addEventListener(
			'hashchange',
			() => {
				if (window.location.hash !== '#interstitial') {
					transition('hidden');
				}
			},
			false,
		);
	}

	async onLeave(): Promise<void> {
		this.button.remove();
	}
}

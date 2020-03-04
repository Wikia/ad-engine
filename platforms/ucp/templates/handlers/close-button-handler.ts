import {
	AdSlot,
	CloseButton,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class CloseButtonHandler implements TemplateStateHandler {
	private button: HTMLButtonElement;

	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {
		this.button = new CloseButton({
			isDarkTheme: this.params.isDarkTheme,
			onClick: () => {
				this.adSlot.emitEvent(universalAdPackage.SLOT_FORCE_UNSTICK);
				transition('transition');
			},
		}).render();
		this.adSlot.getElement().appendChild(this.button);
	}

	async onLeave(): Promise<void> {
		this.button.remove();
	}
}

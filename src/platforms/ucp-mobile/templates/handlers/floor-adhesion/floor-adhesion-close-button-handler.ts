import {
	AdSlot,
	CloseButton,
	InstantConfigService,
	SlotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class FloorAdhesionCloseButtonHandler implements TemplateStateHandler {
	private button: HTMLButtonElement;
	private readonly showCloseButtonAfter?: number;

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, instantConfig: InstantConfigService) {
		this.showCloseButtonAfter = instantConfig.get('icFloorAdhesionTimeToCloseButton', 0);
	}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				transition('hidden');
			},
			classNames: ['floor-adhesion-close-button'],
		}).render();

		setTimeout(() => {
			this.adSlot.getElement().insertAdjacentElement('afterend', this.button);
		}, this.showCloseButtonAfter);
	}

	async onLeave(): Promise<void> {
		this.button.remove();
	}
}

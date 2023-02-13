import {
	AdSlot,
	CloseButton,
	SlotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CloseToHiddenIhiButtonHandler implements TemplateStateHandler {
	private button: HTMLButtonElement;

	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				transition('hidden');
			},
		}).render();

		setTimeout(() => {
			this.adSlot.getElement().appendChild(this.button);
		}, 0);
	}

	async onLeave(): Promise<void> {
		this.button.remove();
	}
}

import {
	AdSlot,
	CloseButton,
	SlotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class CloseToHiddenIhiButtonHandler implements TemplateStateHandler {
	private button: HTMLButtonElement;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				transition('hidden');
			},
		}).render();

		this.adSlot.getElement().appendChild(this.button);
	}

	async onLeave(): Promise<void> {
		this.button.remove();
	}
}

import {
	AdSlot,
	CloseButton,
	InstantConfigService,
	SlotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class CloseToHiddenIhiButtonHandler implements TemplateStateHandler {
	private button: HTMLButtonElement;
	private readonly showCloseButtonAfter?: number;

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, instantConfig: InstantConfigService) {
		this.showCloseButtonAfter =
			this.adSlot.getSlotName() === 'floor_adhesion'
				? instantConfig.get('icFloorAdhesionTimeToCloseButton', 0)
				: instantConfig.get('icInvisibleHighImpact2TimeToCloseButton', 0);
	}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.button = new CloseButton({
			onClick: () => {
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				transition('hidden');
			},
		}).render();

		setTimeout(() => {
			this.adSlot.getElement().appendChild(this.button);
		}, this.showCloseButtonAfter);
	}

	async onLeave(): Promise<void> {
		this.button.remove();
	}
}

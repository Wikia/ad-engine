import { AdSlot, context, slotTweaker, SlotTweaker, utils } from '@ad-engine/core';
import { CloseButton } from '../interface/close-button';

export interface FloorAdhesionConfig {
	onInit: (adSlot: AdSlot) => void;
}

export class FloorAdhesion {
	static getName(): string {
		return 'floorAdhesion';
	}

	static getDefaultConfig(): FloorAdhesionConfig {
		return {
			onInit: () => {},
		};
	}

	private config: FloorAdhesionConfig;

	constructor(public adSlot: AdSlot) {
		this.config = context.get('templates.floorAdhesion') || {};
	}

	init(): void {
		const wrapper = this.adSlot.getElement();
		const closeButton = new CloseButton({
			onClick: () => {
				this.adSlot.hide();
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				utils.logger(FloorAdhesion.getName(), 'closed');
			},
		});

		this.config.onInit(this.adSlot);

		wrapper.appendChild(closeButton.render());
		wrapper.classList.add('floor-adhesion');
		wrapper.classList.add('out-of-page-template');

		slotTweaker.adjustIframeByContentSize(this.adSlot);

		utils.logger(FloorAdhesion.getName(), 'init');
	}
}

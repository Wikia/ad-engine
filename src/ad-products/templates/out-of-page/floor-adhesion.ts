import { AdSlot, context, slotTweaker, SlotTweaker, utils } from '@ad-engine/core';
import { CloseButton } from '../interface/close-button';

export interface FloorAdhesionConfig {
	showCloseButtonAfter: number;
	onInit: (adSlot: AdSlot) => void;
}

export class FloorAdhesion {
	static getName(): string {
		return 'floorAdhesion';
	}

	static getDefaultConfig(): FloorAdhesionConfig {
		return {
			showCloseButtonAfter: 0,
			onInit: () => {},
		};
	}

	private config: FloorAdhesionConfig;

	constructor(public adSlot: AdSlot) {
		this.config = context.get('templates.floorAdhesion') || {};
	}

	init(): void {
		const wrapper = this.adSlot.getElement();

		this.config.onInit(this.adSlot);
		this.addCloseButton(wrapper);

		wrapper.classList.add('floor-adhesion');
		wrapper.classList.add('out-of-page-template');

		slotTweaker.adjustIframeByContentSize(this.adSlot);

		utils.logger(FloorAdhesion.getName(), 'init');
	}

	addCloseButton(wrapper) {
		const closeButton = new CloseButton({
			onClick: () => {
				this.adSlot.hide();
				this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
				utils.logger(FloorAdhesion.getName(), 'closed');
			},
		}).render();

		wrapper.appendChild(closeButton);

		if (this.config.showCloseButtonAfter > 0) {
			closeButton.classList.add('hide');

			setTimeout(() => {
				closeButton.classList.remove('hide');
				utils.logger(FloorAdhesion.getName(), 'adding close button');
			}, this.config.showCloseButtonAfter);
		}
	}
}

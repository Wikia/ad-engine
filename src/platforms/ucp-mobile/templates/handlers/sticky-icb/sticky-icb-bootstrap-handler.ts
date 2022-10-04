import {
	AdSlot,
	babDetection,
	communicationService,
	eventsRepository,
	slotTweaker,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyIcbBootstrapHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'waiting' | 'done'>): Promise<void> {
		await this.adSlot.loaded;
		await slotTweaker.onReady(this.adSlot);
		await this.awaitVisibleDOM();

		if ([AdSlot.STATUS_COLLAPSE, AdSlot.STATUS_FORCED_COLLAPSE].includes(this.adSlot.getStatus())) {
			transition('done');
		}

		const isUap = await this.isUAP();
		if (isUap) {
			transition('done');
		}

		if (babDetection.isBlocking()) {
			transition('done');
		}

		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKY_READY_STATE);
		transition('waiting');
	}

	private async awaitVisibleDOM(): Promise<void> {
		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}
	}

	private async isUAP(): Promise<boolean> {
		return new Promise((resolve) => {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					resolve(action.isLoaded);
				},
			);
		});
	}
}

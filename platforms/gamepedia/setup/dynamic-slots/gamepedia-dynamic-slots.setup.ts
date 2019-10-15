import { DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import { AdSlot, context, slotInjector, slotService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaDynamicSlotsSetup implements DynamicSlotsSetup {
	constructor() {}

	configureDynamicSlots(): void {
		this.injectIncontentPlayer();
	}

	private injectIncontentPlayer(): void {
		const incontentPlayerSlotName = 'incontent_player';
		const porvataAlternativeSlotsName = 'cdm-zone-02';

		if (
			!!document.getElementById('mf-video') ||
			!!document.getElementById('twitchnet-liveontwitch') ||
			!!document.getElementById('ds_cpp')
		) {
			return;
		}

		if (!document.getElementById(porvataAlternativeSlotsName)) {
			this.initiateIncontentPlayer(incontentPlayerSlotName);
		}

		slotService.on(porvataAlternativeSlotsName, AdSlot.STATUS_SUCCESS, () => {
			if (!!context.get('options.video.porvataLoaded')) {
				return;
			}
			this.initiateIncontentPlayer(incontentPlayerSlotName);
		});

		slotService.on(porvataAlternativeSlotsName, AdSlot.STATUS_COLLAPSE, () => {
			this.initiateIncontentPlayer(incontentPlayerSlotName);
		});
	}

	private initiateIncontentPlayer(slotName: string): void {
		slotInjector.inject(slotName);
		slotsContext.setState(slotName, context.get('options.video.isOutstreamEnabled'));
	}
}

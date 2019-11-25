import { CurseUapSetup, DynamicSlotsSetup, slotsContext } from '@platforms/shared';
import {
	AdSlot,
	context,
	InstantConfigService,
	slotInjector,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamepediaDynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(private uapSetup: CurseUapSetup, private instantConfig: InstantConfigService) {}

	configureDynamicSlots(): void {
		if (this.isUapAllowed()) {
			this.uapSetup.configureUap();
		}
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

	private isUapAllowed(): boolean {
		let uapRestriction = this.instantConfig.get('icUapRestriction') || 0;
		const queryParam = utils.queryString.get('uap-pv-restriction');

		if (typeof queryParam !== 'undefined') {
			uapRestriction = parseInt(queryParam, 10);
		}

		return (
			uapRestriction === window.pvNumber || uapRestriction === 0 || context.get('src') === 'test'
		);
	}
}

import {
	AdSlot,
	BaseServiceSetup,
	communicationService,
	context,
	eventsRepository,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const logGroup = 'player-setup';

@Injectable()
export class PlayerSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: utils.GlobalTimeout,
		protected optimizely: Optimizely,
		protected jwpManager: JWPlayerManager,
	) {
		super(instantConfig, globalTimeout);
		this.jwpManager = jwpManager ? jwpManager : new JWPlayerManager();
	}

	call() {
		const showAds = !context.get('options.wad.blocking');
		const vastXml = utils.displayAndVideoAdsSyncContext.getVideoVastXml();
		const connatixInstreamEnabled = !!this.instantConfig.get('icConnatixInstream');
		connatixInstreamEnabled
			? PlayerSetup.initConnatixPlayer(showAds, vastXml)
			: this.initJWPlayer(showAds, vastXml);
	}

	private initJWPlayer(showAds, vastXml) {
		utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');
		this.jwpManager.manage();

		if (showAds) {
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml,
				}),
			);
		} else {
			utils.logger(logGroup, 'ad block detected, without ads');
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
				}),
			);
		}
	}

	private static initConnatixPlayer(showAds, vastXml) {
		utils.logger(logGroup, 'Connatix with ads not controlled by AdEngine enabled');

		const adSlotName = 'featured';
		const adSlot = slotService.get(adSlotName) || new AdSlot({ id: adSlotName });

		communicationService.emit(eventsRepository.VIDEO_SETUP, {
			showAds,
			autoplayDisabled: false,
			videoAdUnitPath: adSlot.getVideoAdUnit(),
			targetingParams: utils.getCustomParameters(adSlot, {}, false),
			vastXml,
		});
	}
}

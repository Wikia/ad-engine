import {
	AdSlot,
	BaseServiceSetup,
	communicationService,
	context,
	displayAndVideoAdsSyncContext,
	eventsRepository,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	Optimizely,
	slotService,
	utils,
	VastResponseData,
	VastTaglessRequest,
	videoDisplayTakeoverSynchronizer,
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
		protected vastTaglessRequest: VastTaglessRequest,
	) {
		super(instantConfig, globalTimeout);
		this.jwpManager = jwpManager ? jwpManager : new JWPlayerManager();
	}

	async call() {
		const showAds = !context.get('options.wad.blocking');
		const vastResponse: VastResponseData =
			displayAndVideoAdsSyncContext.isSyncEnabled() &&
			displayAndVideoAdsSyncContext.isTaglessRequestEnabled()
				? await this.vastTaglessRequest.getVast(
						context.get('options.video.vastRequestTimeout') || 500,
				  )
				: undefined;
		const connatixInstreamEnabled = !!this.instantConfig.get('icConnatixInstream');

		connatixInstreamEnabled
			? PlayerSetup.initConnatixPlayer(showAds, vastResponse)
			: this.initJWPlayer(showAds, vastResponse);
	}

	private initJWPlayer(showAds, vastResponse) {
		utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			utils.logger(logGroup, 'display and video sync response available');
		}

		this.jwpManager.manage();

		if (showAds) {
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml: vastResponse?.xml,
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

	private static initConnatixPlayer(showAds, vastResponse) {
		utils.logger(logGroup, 'Connatix with ads not controlled by AdEngine enabled');

		const adSlotName = 'featured';
		const adSlot = slotService.get(adSlotName) || new AdSlot({ id: adSlotName });

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			utils.logger(logGroup, 'display and video sync response available');
		}

		communicationService.on(eventsRepository.VIDEO_EVENT, (payload) => {
			const { state } = payload.videoEvent;
			videoDisplayTakeoverSynchronizer.resolve(
				state.vastParams.lineItemId,
				state.vastParams.creativeId,
			);
		});

		communicationService.emit(eventsRepository.VIDEO_SETUP, {
			showAds,
			autoplayDisabled: false,
			videoAdUnitPath: adSlot.getVideoAdUnit(),
			targetingParams: utils.getCustomParameters(adSlot, {}, false),
			vastXml: vastResponse?.xml,
		});
	}
}

import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	BaseServiceSetup,
	communicationService,
	context,
	displayAndVideoAdsSyncContext,
	eventsRepository,
	InstantConfigService,
	JWPlayerManager,
	jwpSetup,
	slotService,
	utils,
	VastResponseData,
	VastTaglessRequest,
	videoDisplayTakeoverSynchronizer,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
// eslint-disable-next-line no-restricted-imports
import { iasVideoTracker } from '../../../ad-products/video/porvata/plugins/ias/ias-video-tracker';

const logGroup = 'player-setup';

@Injectable()
export class PlayerSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: utils.GlobalTimeout,
		protected jwpManager: JWPlayerManager,
		protected vastTaglessRequest: VastTaglessRequest,
	) {
		super(instantConfig, globalTimeout);
		this.jwpManager = jwpManager ? jwpManager : new JWPlayerManager();
	}

	async call() {
		communicationService.on(eventsRepository.VIDEO_PLAYER_RENDERED, () => {
			this.loadIasTrackerIfEnabled();
		});
		const showAds = !context.get('options.wad.blocking');
		const vastResponse: VastResponseData | undefined =
			showAds &&
			displayAndVideoAdsSyncContext.isSyncEnabled() &&
			displayAndVideoAdsSyncContext.isTaglessRequestEnabled()
				? await this.vastTaglessRequest.getVast()
				: undefined;
		const connatixFeaturedVideoEnabled =
			this.instantConfig.get('icFeaturedVideoPlayer') === 'connatix';

		connatixFeaturedVideoEnabled
			? PlayerSetup.initConnatixPlayer(showAds, vastResponse)
			: await this.initJWPlayer(showAds, vastResponse);
	}

	private async initJWPlayer(showAds: boolean, vastResponse?: VastResponseData) {
		utils.logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			utils.logger(logGroup, 'display and video sync response available');
		}

		if (showAds && !strategyRulesEnabled) {
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml: vastResponse?.xml,
				}),
			);
			this.jwpManager.manage();
		} else if (strategyRulesEnabled) {
			utils.logger(
				logGroup,
				'JWP Strategy Rules enabled - AdEngine does not control ads in JWP anymore',
			);
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastUrl: await this.vastTaglessRequest.buildTaglessVideoRequest(),
					strategyRulesEnabled,
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

	private loadIasTrackerIfEnabled(): void {
		if (context.get('options.video.iasTracking.enabled')) {
			utils.logger(logGroup, 'Loading IAS tracker for video player');
			iasVideoTracker.load();
		}
	}

	private static initConnatixPlayer(showAds: boolean, vastResponse?: VastResponseData) {
		utils.logger(logGroup, 'Connatix with ads not controlled by AdEngine enabled');

		const videoAdSlotName = 'featured';
		const adSlot = slotService.get(videoAdSlotName) || new AdSlot({ id: videoAdSlotName });

		if (!slotService.get(videoAdSlotName)) {
			slotService.add(adSlot);
		}

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			utils.logger(logGroup, 'display and video sync response available');
		}
		let firstVideoAdImpressionEmitted = false;
		const wasPlayEmittedBeforeAd = (eventName: string) => {
			return eventName === 'play' && !firstVideoAdImpressionEmitted;
		};

		communicationService.on(
			eventsRepository.VIDEO_EVENT,
			(payload) => {
				const { name, state } = payload.videoEvent;

				if (name === 'adImpression') {
					firstVideoAdImpressionEmitted = true;
					videoDisplayTakeoverSynchronizer.resolve(
						state.vastParams.lineItemId,
						state.vastParams.creativeId,
					);
					adSlot.setStatus(AdSlotStatus.STATUS_SUCCESS);
					adSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION);
				} else if (wasPlayEmittedBeforeAd(name)) {
					PlayerSetup.registerTimeoutForVideoDisplayTakeoverSync(
						() => firstVideoAdImpressionEmitted === true,
					);
				} else if (['adError', 'playError'].includes(name)) {
					videoDisplayTakeoverSynchronizer.resolve();
				}
			},
			false,
		);

		communicationService.on(eventsRepository.BIDDERS_BIDDING_DONE, ({ slotName }) => {
			if (slotName === videoAdSlotName) {
				PlayerSetup.emitVideoSetupEvent(showAds, adSlot, vastResponse);
			}
		});
	}

	private static registerTimeoutForVideoDisplayTakeoverSync(condition: () => boolean): void {
		new utils.WaitFor(condition, 1, displayAndVideoAdsSyncContext.getSyncTimeout())
			.until()
			.then(() => {
				videoDisplayTakeoverSynchronizer.resolve();
			});
	}

	private static emitVideoSetupEvent(
		showAds: boolean,
		adSlot: AdSlot,
		vastResponse?: VastResponseData,
	) {
		communicationService.emit(eventsRepository.VIDEO_SETUP, {
			showAds,
			autoplayDisabled: false,
			videoAdUnitPath: adSlot.getVideoAdUnit(),
			targetingParams: utils.getCustomParameters(adSlot, {}, false),
			vastXml: vastResponse?.xml,
		});
	}
}

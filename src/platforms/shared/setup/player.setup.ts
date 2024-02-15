import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	AdSlot,
	AdSlotEvent,
	AdSlotStatus,
	context,
	displayAndVideoAdsSyncContext,
	InstantConfigService,
	slotService,
} from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { getCustomParameters, GlobalTimeout, logger } from '@ad-engine/utils';
import {
	JWPlayerManager,
	jwpSetup,
	VastResponseData,
	VastTaglessRequest,
	videoDisplayTakeoverSynchronizer,
} from '@wikia/ad-products';
import { Injectable } from '@wikia/dependency-injection';
// eslint-disable-next-line no-restricted-imports
import { iasVideoTracker } from '../../../ad-products/video/porvata/plugins/ias/ias-video-tracker';

const logGroup = 'player-setup';

@Injectable()
export class PlayerSetup extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: GlobalTimeout,
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
		logger(logGroup, 'JWP with ads controlled by AdEngine enabled');

		const strategyRulesEnabled = context.get('options.video.enableStrategyRules');

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			logger(logGroup, 'display and video sync response available');
		}

		this.jwpManager.manage();

		if (showAds && !strategyRulesEnabled) {
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastXml: vastResponse?.xml,
				}),
			);
		} else if (strategyRulesEnabled) {
			logger(logGroup, 'JWP Strategy Rules enabled - AdEngine does not control ads in JWP anymore');
			this.jwpManager.manage();
			communicationService.dispatch(
				jwpSetup({
					showAds,
					autoplayDisabled: false,
					vastUrl: await this.vastTaglessRequest.buildTaglessVideoRequest(),
					strategyRulesEnabled,
				}),
			);
		} else {
			logger(logGroup, 'ad block detected, without ads');
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
			logger(logGroup, 'Loading IAS tracker for video player');
			iasVideoTracker.load();
		}
	}

	private static initConnatixPlayer(showAds: boolean, vastResponse?: VastResponseData) {
		logger(logGroup, 'Connatix with ads not controlled by AdEngine enabled');

		const videoAdSlotName = 'featured';
		const adSlot = slotService.get(videoAdSlotName) || new AdSlot({ id: videoAdSlotName });

		if (!slotService.get(videoAdSlotName)) {
			slotService.add(adSlot);
		}

		if (vastResponse?.xml) {
			displayAndVideoAdsSyncContext.setVastRequestedBeforePlayer();
			logger(logGroup, 'display and video sync response available');
		}

		communicationService.on(eventsRepository.VIDEO_EVENT, (payload) => {
			const { name, state } = payload.videoEvent;

			if (name === 'adImpression') {
				videoDisplayTakeoverSynchronizer.resolve(
					state.vastParams.lineItemId,
					state.vastParams.creativeId,
				);
				adSlot.setStatus(AdSlotStatus.STATUS_SUCCESS);
				adSlot.emit(AdSlotEvent.VIDEO_AD_IMPRESSION);
			} else if (['adError', 'play', 'playError'].includes(name)) {
				videoDisplayTakeoverSynchronizer.resolve();
			}
		});

		communicationService.on(eventsRepository.BIDDERS_BIDDING_DONE, ({ slotName }) => {
			if (slotName === videoAdSlotName) {
				PlayerSetup.emitVideoSetupEvent(showAds, adSlot, vastResponse);
			}
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
			targetingParams: getCustomParameters(adSlot, {}, false),
			vastXml: vastResponse?.xml,
		});
	}
}

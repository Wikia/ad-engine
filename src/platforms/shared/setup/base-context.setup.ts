import {
	communicationService,
	context,
	Dictionary,
	DiProcess,
	eventsRepository,
	InstantConfigService,
	setupNpaContext,
	setupRdpContext,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../services/no-ads-detector';

@Injectable()
export class BaseContextSetup implements DiProcess {
	constructor(
		protected instantConfig: InstantConfigService,
		protected noAdsDetector: NoAdsDetector,
	) {}

	execute(): void {
		this.setBaseState();
		this.setOptionsContext();
		this.setServicesContext();
		this.setMiscContext();
		this.setupStickySlotContext();
		setupNpaContext();
		setupRdpContext();
	}

	private setBaseState(): void {
		if (utils.pageInIframe()) {
			this.noAdsDetector.addReason('in_iframe');
		}

		if (utils.client.isSteamPlatform()) {
			this.noAdsDetector.addReason('steam_browser');

			const topLeaderboard = document.querySelector('.top-leaderboard');
			topLeaderboard?.classList.remove('is-loading');

			const bottomLeaderboard = document.querySelector('.bottom-leaderboard');
			bottomLeaderboard?.classList.remove('is-loading');
		}
		if (utils.queryString.get('noexternals')) {
			this.noAdsDetector.addReason('noexternals_querystring');
		}
		if (utils.queryString.get('noads')) {
			this.noAdsDetector.addReason('noads_querystring');
		}

		context.set('state.showAds', this.noAdsDetector.isAdsMode());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));

		if (this.instantConfig.get('icPrebidium')) {
			context.set('state.provider', 'prebidium');
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, {
				isLoaded: false,
				adProduct: universalAdPackage.DEFAULT_UAP_TYPE,
			});
		}
	}

	private setOptionsContext(): void {
		this.setInContentExperiment();

		context.set('options.performanceAds', this.instantConfig.get('icPerformanceAds'));
		context.set('options.stickyTbExperiment', this.instantConfig.get('icStickyTbExperiment'));
		context.set(
			'options.uapExtendedSrcTargeting',
			this.instantConfig.get('icUAPExtendendSrcTargeting'),
		);

		context.set(
			'options.video.playAdsOnNextVideo',
			!!this.instantConfig.get('icFeaturedVideoAdsFrequency'),
		);
		context.set(
			'options.video.adsOnNextVideoFrequency',
			this.instantConfig.get('icFeaturedVideoAdsFrequency', 3),
		);
		context.set('options.video.isMidrollEnabled', this.instantConfig.get('icFeaturedVideoMidroll'));
		context.set(
			'options.video.isPostrollEnabled',
			this.instantConfig.get('icFeaturedVideoPostroll'),
		);
		context.set(
			'options.video.forceVideoAdsOnAllVideosExceptSecond',
			this.instantConfig.get('icFeaturedVideoForceVideoAdsEverywhereExcept2ndVideo'),
		);
		context.set(
			'options.video.forceVideoAdsOnAllVideosExceptSponsored',
			this.instantConfig.get('icFeaturedVideoForceVideoAdsEverywhereExceptSponsoredVideo'),
		);

		context.set(
			'options.floorAdhesionNumberOfViewportsFromTopToPush',
			this.instantConfig.get('icFloorAdhesionViewportsToStart'),
		);
		context.set('options.rotatorDelay', this.instantConfig.get('icRotatorDelay', {}));
		context.set('options.maxDelayTimeout', this.instantConfig.get('icAdEngineDelay', 2000));
		context.set('options.jwpMaxDelayTimeout', this.instantConfig.get('icUAPJWPlayerDelay', 0));
		context.set('options.video.iasTracking.enabled', this.instantConfig.get('icIASVideoTracking'));
		context.set('options.video.isUAPJWPEnabled', this.instantConfig.get('icUAPJWPlayer'));
		context.set(
			'options.video.uapJWPLineItemIds',
			this.instantConfig.get('icUAPJWPlayerLineItemIds'),
		);
		context.set('options.video.pauseJWPlayerAd', this.instantConfig.get('icPauseJWPlayerAd'));
		context.set(
			'options.video.comscoreJwpTracking',
			this.instantConfig.get('icComscoreJwpTracking'),
		);

		this.setWadContext();
	}

	private setInContentExperiment(): void {
		const top500bundleName = 'top500';
		const wiki: MediaWikiAdsContext = context.get('wiki');

		if (
			this.instantConfig.get('icExperiments', []).includes('incontentHeaders') &&
			wiki?.targeting?.adTagManagerTags?.bundles?.includes(top500bundleName)
		) {
			context.set('templates.incontentHeadersExperiment', true);
		} else {
			context.set('templates.incontentAnchorSelector', '.mw-parser-output > h2');
		}
	}

	private setWadContext(): void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (babEnabled && !context.get('state.isLogged') && context.get('state.showAds')) {
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
			context.set('options.wad.btRec.sideUnits', this.instantConfig.get('icBTRecSideUnits'));
		}
	}

	private setServicesContext(): void {
		context.set(
			'services.interventionTracker.enabled',
			this.instantConfig.get('icInterventionTracking'),
		);
		context.set('services.nativo.enabled', this.instantConfig.get('icNativo'));
		context.set('services.ppid.enabled', this.instantConfig.get('icPpid'));
		context.set('services.ppidRepository', this.instantConfig.get('icPpidRepository'));
		context.set('services.identityTtl', this.instantConfig.get('icIdentityTtl'));
		context.set('services.identityPartners', this.instantConfig.get('icIdentityPartners'));
		context.set('services.intentIq.ppid.enabled', this.instantConfig.get('icIntentIqPpid', false));
		context.set(
			'services.intentIq.ppid.tracking.enabled',
			this.instantConfig.get('icIntentIqPpidTracking', false),
		);
		context.set('services.ageGateHandling', this.instantConfig.get('icAgeGateHandling'));

		context.set(
			'services.messageBox.enabled',
			this.instantConfig.get('icAdCollapsedMessageBox', false),
		);
		context.set(
			'services.slotRefresher.config',
			!this.instantConfig.get('icDurationMedia') && this.instantConfig.get('icSlotRefresher'),
		);
	}

	private setMiscContext(): void {
		this.instantConfig.get('icLABradorTest');

		const priceFloorRule = this.instantConfig.get<object>('icPrebidSizePriceFloorRule');
		context.set('bidders.prebid.priceFloor', priceFloorRule || null);
		context.set(
			'bidders.prebid.disableSendAllBids',
			this.instantConfig.get('icPrebidDisableSendAllBids'),
		);
		context.set('bidders.identityHub.enabled', this.instantConfig.get('icPubmaticIdentityHub'));
		// TODO: Remove after ADEN-13043 release & data confirmation
		context.set('bidders.identityHubV2.enabled', this.instantConfig.get('icPubmaticIdentityHubV2'));
		context.set('bidders.liveRampId.enabled', this.instantConfig.get('icLiveRampId'));
		context.set('bidders.liveRampATS.enabled', this.instantConfig.get('icLiveRampATS'));
		context.set(
			'bidders.liveRampATSAnalytics.enabled',
			this.instantConfig.get('icLiveRampATSAnalytics'),
		);
		context.set('bidders.prebid.native.enabled', this.instantConfig.get('icPrebidNative'));
		context.set(
			'templates.sizeOverwritingMap',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes,
		);
	}

	private setupStickySlotContext(): void {
		context.set('templates.stickyTlb.forced', this.instantConfig.get('icForceStickyTlb'));
		context.set('templates.stickyTlb.withFV', this.instantConfig.get('icStickyTlbWithFV'));

		const stickySlotsLines: Dictionary = this.instantConfig.get('icStickySlotLineItemIds');
		if (stickySlotsLines && stickySlotsLines.length) {
			context.set('templates.stickyTlb.lineItemIds', stickySlotsLines);
		}
	}
}

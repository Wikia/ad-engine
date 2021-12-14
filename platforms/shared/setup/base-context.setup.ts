import {
	communicationService,
	context,
	Dictionary,
	DiProcess,
	InstantConfigService,
	setupNpaContext,
	setupRdpContext,
	uapLoadStatus,
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
		if (utils.client.isSteamPlatform()) {
			this.noAdsDetector.addReason('steam_browser');

			const topLeaderboard = document.querySelector('.top-leaderboard');
			topLeaderboard?.classList.remove('is-loading');

			const bottomLeaderboard = document.querySelector('.bottom-leaderboard');
			bottomLeaderboard?.classList.remove('is-loading');
		}
		if (!!utils.queryString.get('noexternals')) {
			this.noAdsDetector.addReason('noexternals_querystring');
		}
		if (!!utils.queryString.get('noads')) {
			this.noAdsDetector.addReason('noads_querystring');
		}

		context.set('state.showAds', this.noAdsDetector.isAdsMode());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));

		if (this.instantConfig.get('icPrebidium')) {
			context.set('state.provider', 'prebidium');
			communicationService.dispatch(
				uapLoadStatus({
					isLoaded: false,
					adProduct: universalAdPackage.DEFAULT_UAP_TYPE,
				}),
			);
		}
	}

	private setOptionsContext(): void {
		context.set('options.tracking.kikimora.player', this.instantConfig.get('icPlayerTracking'));
		context.set('options.tracking.slot.status', this.instantConfig.get('icSlotTracking'));
		context.set(
			'options.tracking.slot.viewability',
			this.instantConfig.get('icViewabilityTracking'),
		);
		context.set('options.tracking.slot.bidder', this.instantConfig.get('icBidsTracking'));
		context.set('options.tracking.postmessage', this.instantConfig.get('icPostmessageTracking'));
		context.set('options.hiviLeaderboard', this.instantConfig.get('icHiViLeaderboardSlot'));
		context.set('options.newBfaaTemplate', this.instantConfig.get('icUAPNewBFAATemplate'));
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
			'options.floorAdhesionNumberOfViewportsFromTopToPush',
			this.instantConfig.get('icFloorAdhesionViewportsToStart'),
		);
		context.set('options.rotatorDelay', this.instantConfig.get('icRotatorDelay', {}));
		context.set('options.maxDelayTimeout', this.instantConfig.get('icAdEngineDelay', 2000));
		context.set('options.jwpMaxDelayTimeout', this.instantConfig.get('icUAPJWPlayerDelay', 0));
		context.set('options.video.iasTracking.enabled', this.instantConfig.get('icIASVideoTracking'));
		context.set('options.video.isUAPJWPEnabled', this.instantConfig.get('icUAPJWPlayer'));
		context.set(
			'options.video.moatTracking.enabledForArticleVideos',
			this.instantConfig.get('icFeaturedVideoMoatTracking'),
		);
		context.set(
			'options.video.moatTracking.enabledForPorvata',
			this.instantConfig.get('icPorvataMoatTracking'),
		);
		context.set('options.video.pauseJWPlayerAd', this.instantConfig.get('icPauseJWPlayerAd'));
		context.set(
			'options.video.comscoreJwpTracking',
			this.instantConfig.get('icComscoreJwpTracking'),
		);

		this.setWadContext();
	}

	private setWadContext(): void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (babEnabled && !context.get('state.isLogged') && context.get('state.showAds')) {
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
		}
	}

	private setServicesContext(): void {
		context.set(
			'services.interventionTracker.enabled',
			this.instantConfig.get('icInterventionTracking'),
		);

		if (!context.get('wiki.opts.enableAdTagManagerBackend')) {
			// if backend call is disabled let's call it on frontend
			context.set('services.taxonomy.enabled', this.instantConfig.get('icTaxonomyAdTags'));
		}

		context.set('services.taxonomy.communityId', context.get('wiki.dsSiteKey'));
		context.set('services.adMarketplace.enabled', this.instantConfig.get('icAdMarketplace'));
		context.set('services.audigent.enabled', this.instantConfig.get('icAudigent'));
		context.set('services.confiant.enabled', this.instantConfig.get('icConfiant'));
		context.set('services.silverSurfer', this.instantConfig.get('icSilverSurfer'));
		context.set('services.durationMedia.enabled', this.instantConfig.get('icDurationMedia'));
		context.set('services.distroScale.enabled', this.instantConfig.get('icDistroScale'));
		context.set('services.facebookPixel.enabled', this.instantConfig.get('icFacebookPixel'));
		context.set(
			'services.iasPublisherOptimization.enabled',
			this.instantConfig.get('icIASPublisherOptimization'),
		);
		context.set('services.nielsen.enabled', this.instantConfig.get('icNielsen'));
		context.set('services.nativo.enabled', this.instantConfig.get('icNativo'));
		context.set('services.permutive.enabled', this.instantConfig.get('icPermutive'));
		context.set('services.stroer.enabled', this.instantConfig.get('icStroer'));
	}

	private setMiscContext(): void {
		this.instantConfig.get('icLABradorTest');

		const priceFloorRule = this.instantConfig.get<object>('icPrebidSizePriceFloorRule');
		context.set('bidders.prebid.priceFloor', priceFloorRule || null);

		context.set('bidders.liveRampId.enabled', this.instantConfig.get('icLiveRampId'));
		context.set('bidders.liveRampATS.enabled', this.instantConfig.get('icLiveRampATS'));
		context.set(
			'bidders.liveRampATSAnalytics.enabled',
			this.instantConfig.get('icLiveRampATSAnalytics'),
		);

		context.set(
			'templates.safeFanTakeoverElement.lineItemIds',
			this.instantConfig.get('icSafeFanTakeoverLineItemIds'),
		);
		context.set(
			'templates.safeFanTakeoverElement.unstickTimeout',
			this.instantConfig.get('icSafeFanTakeoverUnstickTimeout'),
		);
	}

	private setupStickySlotContext(): void {
		context.set('templates.stickyTlb.forced', this.instantConfig.get('icForceStickyTlb'));

		const stickySlotsLines: Dictionary = this.instantConfig.get('icStickySlotLineItemIds');
		if (stickySlotsLines && stickySlotsLines.length) {
			context.set('templates.stickyTlb.lineItemIds', stickySlotsLines);
		}
	}
}

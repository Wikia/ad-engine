import {
	context,
	InstantConfigService,
	setupNpaContext,
	setupRdpContext,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NoAdsDetector } from '../services/no-ads-detector';

@Injectable()
export class BaseContextSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected noAdsDetector: NoAdsDetector,
	) {}

	configureBaseContext(isMobile = false): void {
		this.setBaseState(isMobile);
		this.setOptionsContext();
		this.setServicesContext();
		this.setMiscContext();
		setupNpaContext();
		setupRdpContext();
	}

	private setBaseState(isMobile: boolean): void {
		if (context.get('wiki.opts.showAds') === false) {
			this.noAdsDetector.addReason('show_ads_false');
		}
		if (utils.client.isSteamPlatform()) {
			this.noAdsDetector.addReason('steam_browser');
		}
		if (!!utils.queryString.get('noexternals')) {
			this.noAdsDetector.addReason('noexternals_querystring');
		}
		if (!!utils.queryString.get('noads')) {
			this.noAdsDetector.addReason('noads_querystring');
		}

		context.set('state.isMobile', isMobile);
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
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

		context.set('options.maxDelayTimeout', this.instantConfig.get('icAdEngineDelay', 2000));
		context.set('options.video.iasTracking.enabled', this.instantConfig.get('icIASVideoTracking'));
		context.set('options.video.isOutstreamEnabled', this.instantConfig.get('icOutstreamSlot'));
		context.set(
			'options.video.moatTracking.enabledForArticleVideos',
			this.instantConfig.get('icFeaturedVideoMoatTracking'),
		);

		this.setWadContext();
	}

	private setWadContext(): void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (!context.get('state.isLogged') && babEnabled) {
			// BT rec
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
		}
	}

	private setServicesContext(): void {
		context.set('services.taxonomy.enabled', this.instantConfig.get('icTaxonomyAdTags'));
		context.set('services.taxonomy.communityId', context.get('wiki.dsSiteKey'));
		context.set('services.confiant.enabled', this.instantConfig.get('icConfiant'));
		context.set('services.durationMedia.enabled', this.instantConfig.get('icDurationMedia'));
		context.set('services.distroScale.enabled', this.instantConfig.get('icDistroScale'));
		context.set('services.facebookPixel.enabled', this.instantConfig.get('icFacebookPixel'));
		context.set(
			'services.iasPublisherOptimization.enabled',
			this.instantConfig.get('icIASPublisherOptimization'),
		);
		context.set(
			'services.permutive.enabled',
			this.instantConfig.get('icPermutive') && !context.get('wiki.targeting.directedAtChildren'),
		);
		context.set('services.nielsen.enabled', this.instantConfig.get('icNielsen'));
	}

	private setMiscContext(): void {
		if (this.instantConfig.get('icTestCommunities', []).includes(context.get('wiki.wgDBname'))) {
			context.set('src', 'test');
		}

		this.instantConfig.get('icLABradorTest');

		const priceFloorRule = this.instantConfig.get<object>('icPrebidSizePriceFloorRule');
		context.set('bidders.prebid.priceFloor', priceFloorRule || null);
		context.set('bidders.ixIdentityLibrary.enabled', this.instantConfig.get('icIxIdentityLibrary'));

		context.set(
			'templates.safeFanTakeoverElement.lineItemIds',
			this.instantConfig.get('icSafeFanTakeoverLineItemIds'),
		);
		context.set(
			'templates.safeFanTakeoverElement.unstickTimeout',
			this.instantConfig.get('icSafeFanTakeoverUnstickTimeout'),
		);
	}
}

import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsPageDataGetter } from '../../../utils/news-and-ratings-page-data-getter';

@Injectable()
export class NewsAndRatingsBaseContextSetup implements DiProcess {
	constructor(
		protected instantConfig: InstantConfigService,
		protected newsAndRatingsPageDataGetter: NewsAndRatingsPageDataGetter,
	) {}

	execute(): void {
		this.setBaseState();
		this.setupIdentityOptions();
		this.setupServicesOptions();
		this.setupVideoOptions();
	}

	private setBaseState(): void {
		context.set('custom.device', context.get('state.isMobile') ? 'm' : '');
		context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441);
		context.set('custom.pagePath', this.newsAndRatingsPageDataGetter.getPagePath());
		context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src'));
		context.set('options.tracking.slot.status', this.instantConfig.get('icSlotTracking'));
	}

	private setupIdentityOptions() {
		context.set('services.liveConnect.enabled', this.instantConfig.get('icLiveConnect'));
		context.set(
			'services.liveConnect.cachingStrategy',
			this.instantConfig.get('icLiveConnectCachingStrategy'),
		);

		context.set('services.liveRampPixel.enabled', this.instantConfig.get('icLiveRampPixel'));

		context.set('services.ppid.enabled', this.instantConfig.get('icPpid'));
		context.set('services.ppidRepository', this.instantConfig.get('icPpidRepository'));
	}

	private setupServicesOptions() {
		context.set('services.confiant.propertyId', 'IOegabOoWb7FyEI1AmEa9Ki-5AY');
	}

	private setupVideoOptions() {
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
		context.set('options.video.iasTracking.enabled', this.instantConfig.get('icIASVideoTracking'));
		context.set(
			'options.video.moatTracking.enabledForArticleVideos',
			this.instantConfig.get('icFeaturedVideoMoatTracking'),
		);
		context.set(
			'options.video.comscoreJwpTracking',
			this.instantConfig.get('icComscoreJwpTracking'),
		);
		context.set('options.video.pauseJWPlayerAd', this.instantConfig.get('icPauseJWPlayerAd'));

		context.set('services.anyclip.enabled', this.instantConfig.get('icAnyclipPlayer'));
		context.set('services.anyclip.isApplicable', () => {
			this.log(
				'Anyclip setting:',
				this.newsAndRatingsPageDataGetter.getDataSettingsFromMetaTag()?.target_params?.anyclip,
			);
			return this.newsAndRatingsPageDataGetter.getDataSettingsFromMetaTag()?.target_params?.anyclip;
		});
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}

	private log(...logValues) {
		utils.logger('setup', ...logValues);
	}
}

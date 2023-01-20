import { context, DiProcess, InstantConfigService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsBaseContextSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		this.setBaseState();
		this.setupIdentityOptions();
		this.setupVideoOptions();
	}

	private setBaseState(): void {
		const isDesktop = utils.client.isDesktop();

		context.set('custom.device', isDesktop ? '' : 'm');
		context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441);
		context.set('custom.pagePath', this.getPagePath());
		context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src'));
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
	}

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}

	private getPagePath(): string {
		const dataWithPagePath = this.getDataSettingsFromMetaTag();
		const pagePath = dataWithPagePath?.unit_name
			? this.getPagePathFromMetaTagData(dataWithPagePath)
			: this.getPagePathFromUtagData();

		if (!pagePath) {
			return '';
		}

		return pagePath[0] === '/' ? pagePath : '/' + pagePath;
	}

	private getPagePathFromMetaTagData(dataWithPagePath) {
		const adUnitPropertyPart = context.get('custom.property');
		const propertyIndex = dataWithPagePath?.unit_name?.indexOf(adUnitPropertyPart);
		const slicedUnitName = dataWithPagePath?.unit_name?.slice(propertyIndex);

		return slicedUnitName.replace(adUnitPropertyPart, '');
	}

	private getPagePathFromUtagData() {
		const dataWithPagePath = this.getUtagData();
		return dataWithPagePath?.siteSection;
	}

	getDataSettingsFromMetaTag() {
		const adSettingsJson = document.getElementById('ad-settings')?.getAttribute('data-settings');
		utils.logger('setup', 'Ad settings: ', adSettingsJson);

		if (!adSettingsJson) {
			return null;
		}

		try {
			return JSON.parse(adSettingsJson);
		} catch (e) {
			utils.logger('setup', 'Could not parse JSON');
			return null;
		}
	}

	getUtagData() {
		const utagData = window.utag_data;
		utils.logger('setup', 'utag data: ', utagData);
		return utagData;
	}
}

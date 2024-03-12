import { context, Dictionary, InstantConfigService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { logger, queryString } from '@ad-engine/utils';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NewsAndRatingsBaseContextSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		this.setBaseState();
		this.setupIdentityOptions();
		this.setupServicesOptions();
		this.setupVideo();
		this.setupStickySlotContext();
	}

	private setBaseState(): void {
		context.set('custom.device', context.get('state.isMobile') ? 'm' : '');
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
		context.set('services.identityTtl', this.instantConfig.get('icIdentityTtl'));
	}

	private setupServicesOptions() {
		context.set('options.maxDelayTimeout', this.instantConfig.get('icAdEngineDelay', 2000));
		context.set(
			'bidders.prebid.disableSendAllBids',
			this.instantConfig.get('icPrebidDisableSendAllBids'),
		);
		context.set('services.captify.propertyId', 13061);
		context.set('services.confiant.propertyId', 'IOegabOoWb7FyEI1AmEa9Ki-5AY');
		context.set(
			'bidders.liveIntentConnectedId.enabled',
			this.instantConfig.get('icLiveIntentConnectedId'),
		);
	}

	private setupVideo() {
		context.set('vast.adUnitId', this.buildVastAdUnit());

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
		context.set('options.video.iasTracking.enabled', this.instantConfig.get('icIASVideoTracking'));
		context.set(
			'options.video.comscoreJwpTracking',
			this.instantConfig.get('icComscoreJwpTracking'),
		);
		context.set('services.anyclip.enabled', this.instantConfig.get('icAnyclipPlayer'));
		context.set(
			'services.anyclip.anyclipTagExists',
			!!this.getDataSettingsFromMetaTag()?.anyclip ||
				!!this.getDataSettingsFromMetaTag()?.target_params?.anyclip,
		);
	}

	private setupStickySlotContext(): void {
		context.set('templates.stickyTlb.forced', this.instantConfig.get('icForceStickyTlb'));

		const stickySlotsLines: Dictionary = this.instantConfig.get('icStickySlotLineItemIds');
		const stickySlotsOrders: Dictionary = this.instantConfig.get('icStickySlotOrderIds');
		if (stickySlotsLines && stickySlotsLines.length) {
			context.set('templates.stickyTlb.lineItemIds', stickySlotsLines);
		}
		if (stickySlotsOrders && stickySlotsOrders.length) {
			context.set('templates.stickyTlb.ordersIds', stickySlotsOrders);
		}
	}

	private buildVastAdUnit(): string {
		const dfpId = context.get('custom.dfpId');
		const region = context.get('custom.region');
		const property = context.get('custom.property');
		const device = context.get('custom.device') === 'm' ? 'mobile' : 'desktop';
		const pagePath = context.get('custom.pagePath');

		return `${dfpId}/v${region}-${property}/${device}${pagePath}`;
	}

	private shouldSwitchGamToRV() {
		return queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return queryString.get('switch_src_to_test') === '1';
	}

	private getPagePath(): string {
		const dataWithPagePath = this.getDataSettingsFromMetaTag();
		const pagePath = dataWithPagePath?.unit_name
			? this.getPagePathFromMetaTagData(dataWithPagePath)
			: this.getPagePathFromGtagData();

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

	private getPagePathFromGtagData() {
		const dataWithPagePath = this.getGtagData();
		return dataWithPagePath?.data?.siteSection;
	}

	getDataSettingsFromMetaTag() {
		const adSettingsJson = document.getElementById('ad-settings')?.getAttribute('data-settings');
		this.log('Ad settings: ', adSettingsJson);

		if (!adSettingsJson) {
			return null;
		}

		try {
			return JSON.parse(adSettingsJson);
		} catch (e) {
			this.log('Could not parse JSON');
			return null;
		}
	}

	getGtagData() {
		const gtagData = window.dataLayer.find(({ event }) => event === 'Pageview');
		this.log('tag data: ', gtagData);
		return gtagData;
	}

	private log(...logValues) {
		logger('setup', ...logValues);
	}
}

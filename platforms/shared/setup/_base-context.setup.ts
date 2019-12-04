import {
	context,
	InstantConfigService,
	setupNpaContext,
	setupRdpContext,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BaseContextSetup {
	constructor(private instantConfig: InstantConfigService) {}

	configureBaseContext(isMobile = false): void {
		this.setBaseState(isMobile);
		this.setOptionsContext();
		this.setServicesContext();
		this.setMiscContext();
		setupNpaContext();
		setupRdpContext();
	}

	private setBaseState(isMobile: boolean): void {
		context.set('state.isMobile', isMobile);
		context.set('state.showAds', !utils.client.isSteamPlatform());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
	}

	private setOptionsContext(): void {
		context.set('options.tracking.kikimora.player', true);
		context.set('options.tracking.slot.status', true);
		context.set('options.tracking.slot.viewability', true);
		context.set('options.tracking.postmessage', this.instantConfig.get('icPostmessageTracking'));
		context.set('options.maxDelayTimeout', this.instantConfig.get('wgAdDriverDelayTimeout', 2000));
		context.set(
			'options.video.isOutstreamEnabled',
			this.instantConfig.isGeoEnabled('wgAdDriverOutstreamSlotCountries'),
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
	}

	private setMiscContext(): void {
		if (
			this.instantConfig.get('wgAdDriverTestCommunities', []).includes(context.get('wiki.wgDBname'))
		) {
			context.set('src', 'test');
		}

		this.instantConfig.isGeoEnabled('wgAdDriverLABradorTestCountries');

		const priceFloorRule = this.instantConfig.get<object>('icPrebidSizePriceFloorRule');
		context.set('bidders.prebid.priceFloor', priceFloorRule || null);
	}
}

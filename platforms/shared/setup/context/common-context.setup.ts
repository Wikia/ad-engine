import { context, InstantConfigService, setupNpaContext, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { ContextSetup } from './_context.setup';
import { A9ConfigSetup } from './a9/_a9-config.setup';
import { PrebidConfigSetup } from './prebid/_prebid-config.setup';
import { SlotsContextSetup } from './slots/_slots-context.setup';
import { TargetingSetup } from './targeting/_targeting.setup';
import { WikiContextSetup } from './wiki/_wiki-context-setup';

@Injectable()
export class CommonContextSetup implements ContextSetup {
	constructor(
		private wikiContextSetup: WikiContextSetup,
		private instantConfig: InstantConfigService,
		private targetingSetup: TargetingSetup,
		private slotsContextSetup: SlotsContextSetup,
		private prebidConfigSetup: PrebidConfigSetup,
		private a9ConfigSetup: A9ConfigSetup,
	) {}

	configureContext(isOptedIn = false, isMobile = false): void {
		this.wikiContextSetup.configureWikiContext();
		this.setBaseState(isMobile);
		this.setOptionsContext(isOptedIn);
		this.setServicesContext();
		this.setMiscContext();
		this.targetingSetup.configureTargetingContext();
		this.slotsContextSetup.configureSlotsContext();
		this.prebidConfigSetup.configurePrebidContext();
		this.a9ConfigSetup.configureA9Context();
		setupNpaContext();
	}

	private setBaseState(isMobile: boolean): void {
		context.set('state.isMobile', isMobile);
		context.set('state.showAds', !utils.client.isSteamPlatform());
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
	}

	private setOptionsContext(isOptedIn: boolean): void {
		context.set('options.tracking.kikimora.player', true);
		context.set('options.tracking.slot.status', true);
		context.set('options.tracking.slot.viewability', true);
		context.set('options.tracking.postmessage', this.instantConfig.get('icPostmessageTracking'));
		context.set('options.trackingOptIn', isOptedIn);
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
	}
}

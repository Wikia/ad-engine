import { biddersContext, slotsContext } from '@platforms/shared';
import {
	AdSlot,
	context,
	InstantConfigService,
	setupNpaContext,
	slotInjector,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { set } from 'lodash';
import { targeting } from './targeting';
import { templateRegistry } from './templates/templates-registry';
import {
	registerPorvataTracker,
	registerPostmessageTrackingTracker,
	registerSlotTracker,
	registerViewabilityTracker,
} from './tracking/tracker';

const fallbackInstantConfig = {
	wgAdDriverA9BidderCountries: ['XX'],
	wgAdDriverA9DealsCountries: ['XX'],
	wgAdDriverAppNexusBidderCountries: ['XX'],
	wgAdDriverBabDetection: ['XX'],
	wgAdDriverDelayTimeout: 2000,
	wgAdDriverIndexExchangeBidderCountries: ['XX'],
	wgAdDriverLABradorTestCountries: ['PL/40-cached'],
	wgAdDriverOpenXPrebidBidderCountries: ['XX'],
	wgAdDriverOutstreamSlotCountries: [],
	wgAdDriverPrebidBidderCountries: ['XX'],
	wgAdDriverPubMaticBidderCountries: ['XX'],
	wgAdDriverRubiconDisplayPrebidCountries: ['XX'],
	wgAdDriverTestCommunities: ['cdm_gamepedia', 'project43'],
	wgAdDriverUapCountries: ['XX'],
	wgAdDriverUapRestriction: 1,
};

class ContextSetup {
	private instantConfig: InstantConfigService;

	async configure(wikiContext, isOptedIn: boolean): Promise<void> {
		set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
		this.instantConfig = await InstantConfigService.init();

		this.setupAdContext(wikiContext, isOptedIn);
		setupNpaContext();
		templateRegistry.registerTemplates();

		registerPorvataTracker();
		registerSlotTracker();
		registerViewabilityTracker();
		registerPostmessageTrackingTracker();
	}

	private setupAdContext(wikiContext, isOptedIn = false): void {
		const isMobile = !utils.client.isDesktop();

		context.set('wiki', wikiContext);
		context.set('state.showAds', true);
		context.set('state.isMobile', isMobile);
		context.set('state.isLogged', !!wikiContext.wgUserId);
		context.set('state.deviceType', utils.client.getDeviceType());

		context.set('options.tracking.kikimora.player', true);
		context.set('options.tracking.slot.status', true);
		context.set('options.tracking.slot.viewability', true);
		context.set('options.trackingOptIn', isOptedIn);
		context.set('options.tracking.postmessage', true);

		context.set(
			'options.video.isOutstreamEnabled',
			this.instantConfig.isGeoEnabled('wgAdDriverOutstreamSlotCountries'),
		);

		context.set('bidders', biddersContext.generate());

		if (this.instantConfig.isGeoEnabled('wgAdDriverA9BidderCountries')) {
			context.set('bidders.a9.enabled', true);
			context.set(
				'bidders.a9.dealsEnabled',
				this.instantConfig.isGeoEnabled('wgAdDriverA9DealsCountries'),
			);
		}

		if (this.instantConfig.isGeoEnabled('wgAdDriverPrebidBidderCountries')) {
			context.set('bidders.prebid.enabled', true);
			context.set(
				'bidders.prebid.appnexus.enabled',
				this.instantConfig.isGeoEnabled('wgAdDriverAppNexusBidderCountries'),
			);
			context.set(
				'bidders.prebid.indexExchange.enabled',
				this.instantConfig.isGeoEnabled('wgAdDriverIndexExchangeBidderCountries'),
			);
			context.set(
				'bidders.prebid.openx.enabled',
				this.instantConfig.isGeoEnabled('wgAdDriverOpenXPrebidBidderCountries'),
			);

			context.set(
				'bidders.prebid.pubmatic.enabled',
				this.instantConfig.isGeoEnabled('wgAdDriverPubMaticBidderCountries'),
			);
			context.set(
				'bidders.prebid.rubicon_display.enabled',
				this.instantConfig.isGeoEnabled('wgAdDriverRubiconDisplayPrebidCountries'),
			);
		}

		context.set(
			'bidders.enabled',
			context.get('bidders.prebid.enabled') || context.get('bidders.a9.enabled'),
		);

		context.set('services.taxonomy.enabled', this.instantConfig.get('icTaxonomyAdTags'));
		context.set('services.taxonomy.communityId', context.get('wiki.dsSiteKey'));

		this.instantConfig.isGeoEnabled('wgAdDriverLABradorTestCountries');

		context.set('slots', slotsContext.generate());

		if (this.instantConfig.get('wgAdDriverTestCommunities', []).includes(wikiContext.wgDBname)) {
			context.set('src', 'test');
		}

		this.setupPageLevelTargeting(context.get('wiki'));

		if (this.isUapAllowed()) {
			const uapSize: [number, number] = isMobile ? [2, 2] : [3, 3];
			slotsContext.addSlotSize('cdm-zone-01', uapSize);
		}

		context.set('options.maxDelayTimeout', this.instantConfig.get('wgAdDriverDelayTimeout', 2000));
		context.set('services.confiant.enabled', this.instantConfig.get('icConfiant'));

		this.injectIncontentPlayer();

		slotsContext.setupStates();

		this.updateWadContext();
	}

	private setupPageLevelTargeting(wikiContext): void {
		const pageLevelParams = targeting.getPageLevelTargeting(wikiContext);

		Object.keys(pageLevelParams).forEach((key) => {
			context.set(`targeting.${key}`, pageLevelParams[key]);
		});
	}

	private updateWadContext(): void {
		const babEnabled = this.instantConfig.get('icBabDetection');

		// BlockAdBlock detection
		context.set('options.wad.enabled', babEnabled);

		if (!context.get('state.isLogged') && babEnabled) {
			// BT rec
			context.set('options.wad.btRec.enabled', this.instantConfig.get('icBTRec'));
		}
	}

	private isUapAllowed(): boolean {
		let uapRestriction = this.instantConfig.get('wgAdDriverUapRestriction');
		const queryParam = utils.queryString.get('uap-pv-restriction');

		if (typeof queryParam !== 'undefined') {
			uapRestriction = parseInt(queryParam, 10);
		}

		const isUapAllowed =
			uapRestriction === window.pvNumber || uapRestriction === 0 || context.get('src') === 'test';

		return isUapAllowed && this.instantConfig.isGeoEnabled('wgAdDriverUapCountries');
	}

	private injectIncontentPlayer(): void {
		const incontentPlayerSlotName = 'incontent_player';
		const porvataAlternativeSlotsName = 'cdm-zone-02';

		if (
			!!document.getElementById('mf-video') ||
			!!document.getElementById('twitchnet-liveontwitch') ||
			!!document.getElementById('ds_cpp')
		) {
			return;
		}

		if (!document.getElementById(porvataAlternativeSlotsName)) {
			this.initiateIncontentPlayer(incontentPlayerSlotName);
		}

		slotService.on(porvataAlternativeSlotsName, AdSlot.STATUS_SUCCESS, () => {
			if (!!context.get('options.video.porvataLoaded')) {
				return;
			}
			this.initiateIncontentPlayer(incontentPlayerSlotName);
		});

		slotService.on(porvataAlternativeSlotsName, AdSlot.STATUS_COLLAPSE, () => {
			this.initiateIncontentPlayer(incontentPlayerSlotName);
		});
	}

	private initiateIncontentPlayer(slotName: string): void {
		slotInjector.inject(slotName);
		slotsContext.setState(slotName, context.get('options.video.isOutstreamEnabled'));
	}
}

export const adsSetup = new ContextSetup();

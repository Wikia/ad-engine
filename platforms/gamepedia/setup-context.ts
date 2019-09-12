import {
	registerPorvataTracker,
	registerPostmessageTrackingTracker,
	registerSlotTracker,
	registerViewabilityTracker,
	setupBidders,
	slotsContext,
	uapHelper,
} from '@platforms/shared';
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
import { setA9AdapterConfig } from './bidders/a9';
import { setPrebidAdaptersConfig } from './bidders/prebid';
import * as fallbackInstantConfig from './fallback-config.json';
import { targeting } from './targeting';
import { templateRegistry } from './templates/templates-registry';

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

		setA9AdapterConfig();
		setPrebidAdaptersConfig();
		setupBidders(context, this.instantConfig);

		context.set('services.taxonomy.enabled', this.instantConfig.get('icTaxonomyAdTags'));
		context.set('services.taxonomy.communityId', context.get('wiki.dsSiteKey'));

		this.instantConfig.isGeoEnabled('wgAdDriverLABradorTestCountries');

		context.set('slots', slotsContext.generate());

		if (this.instantConfig.get('wgAdDriverTestCommunities', []).includes(wikiContext.wgDBname)) {
			context.set('src', 'test');
		}

		this.setupPageLevelTargeting(context.get('wiki'));

		if (uapHelper.isUapAllowed(this.instantConfig.get('icUapRestriction'))) {
			uapHelper.configureUap();
		}

		context.set('options.maxDelayTimeout', this.instantConfig.get('wgAdDriverDelayTimeout', 2000));
		context.set('services.confiant.enabled', this.instantConfig.get('icConfiant'));
		context.set('services.durationMedia.enabled', this.instantConfig.get('icDurationMedia'));

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

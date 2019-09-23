import {
	getDeviceMode,
	registerSlotTracker,
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
import { getPageLevelTargeting } from './targeting';
import { templateRegistry } from './templates/templates-registry';

class ContextSetup {
	private instantConfig: InstantConfigService;

	async configure(isOptedIn: boolean): Promise<void> {
		set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
		this.instantConfig = await InstantConfigService.init();

		this.setupAdContext(isOptedIn);
		setupNpaContext();
		templateRegistry.registerTemplates();
		registerSlotTracker();
	}

	private setupAdContext(isOptedIn = false): void {
		const isMobile = getDeviceMode() === 'mobile';

		context.set('state.showAds', !utils.client.isSteamPlatform());
		context.set('state.isMobile', isMobile);
		context.set('state.deviceType', utils.client.getDeviceType());

		context.set('options.tracking.kikimora.player', true);
		context.set('options.tracking.slot.status', true);
		context.set('options.tracking.slot.viewability', true);
		context.set('options.trackingOptIn', isOptedIn);

		context.set(
			'options.video.isOutstreamEnabled',
			this.instantConfig.isGeoEnabled('wgAdDriverOutstreamSlotCountries'),
		);

		setA9AdapterConfig();
		setPrebidAdaptersConfig();
		setupBidders(context, this.instantConfig);

		this.instantConfig.isGeoEnabled('wgAdDriverLABradorTestCountries');

		context.set('slots', slotsContext.generate());
		context.set('targeting', getPageLevelTargeting());
		context.set('options.maxDelayTimeout', this.instantConfig.get('wgAdDriverDelayTimeout', 2000));

		this.injectIncontentPlayer();

		uapHelper.configureUap();
		slotsContext.setupStates();

		this.updateWadContext();
	}

	private updateWadContext(): void {
		// BlockAdBlock detection
		context.set('options.wad.enabled', this.instantConfig.get('icBabDetection'));
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

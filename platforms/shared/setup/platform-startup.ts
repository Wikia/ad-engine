import {
	bidders,
	BiddersStateSetup,
	context,
	events,
	eventService,
	setupNpaContext,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { BiddersConfigSetup } from '../bidders/bidders-config-setup';
import { SlotsSetup } from '../slots/slots-setup';
import { TemplateSetup } from '../templates/template-setup';
import { LabradorTracker } from '../tracking/labrador-tracker';
import { TrackingRegistry } from '../tracking/tracking-registry';
import { DelayModulesSetup } from './delay-modules-setup';
import { IncontentPlayerInjector } from './inject-incontent-player';
import { PlatformAdsMode } from './platform-ads-mode';
import { PlatformContextSetup } from './platform-context-setup';
import { PlatformNoAdsMode } from './platform-no-ads-mode';
import { TargetingSetup } from './targeting-setup';
import { UapSetup } from './uap-setup';
import { WikiContextSetup } from './wiki-context-setup';

const logGroup = 'ad-engine';

@Injectable()
export class PlatformStartup {
	constructor(
		private trackingRegistry: TrackingRegistry,
		private wikiContextSetup: WikiContextSetup,
		private targetingSetup: TargetingSetup,
		private platformContextSetup: PlatformContextSetup,
		private biddersStateSetup: BiddersStateSetup,
		private biddersConfigSetup: BiddersConfigSetup,
		private templateSetup: TemplateSetup,
		private uapSetup: UapSetup,
		private slotsSetup: SlotsSetup,
		private incontentPlayerInjector: IncontentPlayerInjector,
		private delayModulesSetup: DelayModulesSetup,
		private labradorTracker: LabradorTracker,
		private noAdsMode: PlatformNoAdsMode,
		private adsMode: PlatformAdsMode,
	) {}

	configure({ isOptedIn = false, isMobile = false }): void {
		this.wikiContextSetup.setWikiContext();
		this.platformContextSetup.setStateContext(isMobile);
		this.platformContextSetup.setOptionsContext(isOptedIn);
		this.platformContextSetup.setServicesContext();
		this.platformContextSetup.setMiscContext();
		this.targetingSetup.setTargetingContext();
		this.slotsSetup.setSlotsContext();
		this.slotsSetup.setSlotsState();
		this.incontentPlayerInjector.injectIncontentPlayer();
		this.uapSetup.configureUap();
		this.biddersStateSetup.setBiddersStateContext();
		this.biddersConfigSetup.setBiddersConfigContext();
		setupNpaContext();
		this.templateSetup.registerTemplates();
		this.trackingRegistry.registerTrackers();
		this.labradorTracker.trackLabradorValues();
		this.delayModulesSetup.setupDelayModules();
		this.configureEventService();
	}

	private configureEventService(): void {
		eventService.on(events.AD_SLOT_CREATED, (slot) => {
			utils.logger(logGroup, `Created ad slot ${slot.getSlotName()}`);
			bidders.updateSlotTargeting(slot.getSlotName());
		});
	}

	run(): void {
		if (context.get('state.showAds')) {
			this.adsMode.handleAds();
		} else {
			this.noAdsMode.handleNoAds();
		}
	}
}

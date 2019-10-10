import { bidders, BiddersStateSetup, context, events, eventService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SlotsSetup } from '../slots/slots-setup';
import { TemplateSetup } from '../templates/template-setup';
import { LabradorTracker } from '../tracking/labrador-tracker';
import { TrackingRegistry } from '../tracking/tracking-registry';
import { ContextSetup } from './context/_context.setup';
import { DelayModulesSetup } from './delay-modules-setup';
import { IncontentPlayerInjector } from './inject-incontent-player';
import { PlatformAdsMode } from './platform-ads-mode';
import { PlatformContextSetup } from './platform-context-setup';
import { PlatformNoAdsMode } from './platform-no-ads-mode';

const logGroup = 'ad-engine';

export interface PlatformStartupArgs {
	isOptedIn: boolean;
	isMobile: boolean;
}

@Injectable()
export class PlatformStartup {
	constructor(
		private contextSetup: ContextSetup,
		private trackingRegistry: TrackingRegistry,
		private platformContextSetup: PlatformContextSetup,
		private biddersStateSetup: BiddersStateSetup,
		private templateSetup: TemplateSetup,
		private slotsSetup: SlotsSetup,
		private incontentPlayerInjector: IncontentPlayerInjector,
		private delayModulesSetup: DelayModulesSetup,
		private labradorTracker: LabradorTracker,
		private noAdsMode: PlatformNoAdsMode,
		private adsMode: PlatformAdsMode,
	) {}

	configure(args: PlatformStartupArgs): void {
		this.contextSetup.configureContext(args.isOptedIn);

		this.platformContextSetup.setStateContext(args.isMobile);
		this.slotsSetup.setSlotsState();
		this.incontentPlayerInjector.injectIncontentPlayer();
		this.biddersStateSetup.setBiddersStateContext();
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

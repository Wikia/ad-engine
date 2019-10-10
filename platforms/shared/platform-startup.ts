import { bidders, context, events, eventService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdsMode } from './modes/ads/_ads.mode';
import { NoAdsMode } from './modes/no-ads/_no-ads.mode';
import { ContextSetup } from './setup/context/_context.setup';
import { DelayModulesSetup } from './setup/delay-modules-setup';
import { IncontentPlayerInjector } from './setup/inject-incontent-player';
import { StateSetup } from './setup/state/_state.setup';
import { TemplateSetup } from './templates/template-setup';
import { LabradorTracker } from './tracking/labrador-tracker';
import { TrackingRegistry } from './tracking/tracking-registry';

const logGroup = 'ad-engine';

export interface PlatformStartupArgs {
	isOptedIn: boolean;
	isMobile: boolean;
}

@Injectable()
export class PlatformStartup {
	constructor(
		private contextSetup: ContextSetup,
		private stateSetup: StateSetup,
		private trackingRegistry: TrackingRegistry,
		private templateSetup: TemplateSetup,
		private incontentPlayerInjector: IncontentPlayerInjector,
		private delayModulesSetup: DelayModulesSetup,
		private labradorTracker: LabradorTracker,
		private noAdsMode: NoAdsMode,
		private adsMode: AdsMode,
	) {}

	configure(args: PlatformStartupArgs): void {
		this.contextSetup.configureContext(args.isOptedIn);
		this.stateSetup.configureState(args.isMobile);

		this.incontentPlayerInjector.injectIncontentPlayer();
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

import { bidders, context, events, eventService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { TemplateSetup } from '../templates/template-setup';
import { LabradorTracker } from '../tracking/labrador-tracker';
import { TrackingRegistry } from '../tracking/tracking-registry';
import { ContextSetup } from './context/_context.setup';
import { DelayModulesSetup } from './delay-modules-setup';
import { IncontentPlayerInjector } from './inject-incontent-player';
import { PlatformAdsMode } from './platform-ads-mode';
import { PlatformNoAdsMode } from './platform-no-ads-mode';
import { StateSetup } from './state/_state.setup';

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
		private noAdsMode: PlatformNoAdsMode,
		private adsMode: PlatformAdsMode,
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

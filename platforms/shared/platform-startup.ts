import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdsMode } from './modes/ads/_ads.mode';
import { NoAdsMode } from './modes/no-ads/_no-ads.mode';
import { AdEngineRunnerSetup } from './setup/ad-engine-runner/_ad-engine-runner.setup';
import { ContextSetup } from './setup/context/_context.setup';
import { DynamicSlotsSetup } from './setup/dynamic-slots/_dynamic-slots.setup';
import { StateSetup } from './setup/state/_state.setup';
import { TemplatesSetup } from './setup/templates/_templates.setup';
import { TrackingSetup } from './setup/tracking/_tracking.setup';

export interface PlatformStartupArgs {
	isOptedIn: boolean;
	isMobile: boolean;
}

@Injectable()
export class PlatformStartup {
	constructor(
		private contextSetup: ContextSetup,
		private stateSetup: StateSetup,
		private dynamicSlotsSetup: DynamicSlotsSetup,
		private templatesSetup: TemplatesSetup,
		private trackingSetup: TrackingSetup,
		private adEngineRunnerSetup: AdEngineRunnerSetup,
		private noAdsMode: NoAdsMode,
		private adsMode: AdsMode,
	) {}

	configure(args: PlatformStartupArgs): void {
		this.contextSetup.configureContext(args.isOptedIn);
		this.stateSetup.configureState(args.isMobile);
		this.dynamicSlotsSetup.configureDynamicSlots();
		this.templatesSetup.configureTemplates();
		this.trackingSetup.configureTracking();
		this.adEngineRunnerSetup.configureAdEngineRunner();
	}

	run(): void {
		if (context.get('state.showAds')) {
			this.adsMode.handleAds();
		} else {
			this.noAdsMode.handleNoAds();
		}
	}
}

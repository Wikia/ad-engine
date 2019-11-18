import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdsMode } from './modes/ads/_ads.mode';
import { NoAdsMode } from './modes/no-ads/_no-ads.mode';
import { AdEngineRunnerSetup } from './setup/ad-engine-runner/_ad-engine-runner.setup';
import { A9ConfigSetup } from './setup/context/_a9-config.setup';
import { PrebidConfigSetup } from './setup/context/_prebid-config.setup';
import { SlotsContextSetup } from './setup/context/_slots-context.setup';
import { TargetingSetup } from './setup/context/_targeting.setup';
import { WikiContextSetup } from './setup/context/_wiki-context.setup';
import { BaseContextSetup } from './setup/context/base-context.setup';
import { DynamicSlotsSetup } from './setup/dynamic-slots/_dynamic-slots.setup';
import { BiddersStateSetup } from './setup/state/bidders/_bidders-state.setup';
import { SlotsStateSetup } from './setup/state/slots/_slots-state.setup';
import { TemplatesSetup } from './setup/templates/_templates.setup';
import { TrackingSetup } from './setup/tracking/_tracking.setup';

export interface PlatformStartupArgs {
	isOptedIn: boolean;
	isMobile: boolean;
}

@Injectable()
export class PlatformStartup {
	constructor(
		private wikiContextSetup: WikiContextSetup,
		private baseContextSetup: BaseContextSetup,
		private targetingSetup: TargetingSetup,
		private slotsContextSetup: SlotsContextSetup,
		private prebidConfigSetup: PrebidConfigSetup,
		private a9ConfigSetup: A9ConfigSetup,
		// ---
		private slotsStateSetup: SlotsStateSetup,
		private biddersStateSetup: BiddersStateSetup,
		// ---
		private dynamicSlotsSetup: DynamicSlotsSetup,
		// ---
		private templatesSetup: TemplatesSetup,
		private trackingSetup: TrackingSetup,
		private adEngineRunnerSetup: AdEngineRunnerSetup,
		private noAdsMode: NoAdsMode,
		private adsMode: AdsMode,
	) {}

	configure(args: PlatformStartupArgs): void {
		// Context
		this.wikiContextSetup.configureWikiContext();
		this.baseContextSetup.configureBaseContext(args.isOptedIn, args.isMobile);
		this.targetingSetup.configureTargetingContext();
		this.slotsContextSetup.configureSlotsContext();
		this.prebidConfigSetup.configurePrebidContext();
		this.a9ConfigSetup.configureA9Context();
		// State
		this.slotsStateSetup.configureSlotsState();
		this.biddersStateSetup.configureBiddersState();
		// Dynamic Slots
		this.dynamicSlotsSetup.configureDynamicSlots();
		//
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

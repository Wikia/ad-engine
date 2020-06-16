import { context, globalAction } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { AdsMode } from './modes/ads/_ads.mode';
import { NoAdsMode } from './modes/no-ads/_no-ads.mode';
import { A9ConfigSetup } from './setup/_a9-config.setup';
import { AdEngineRunnerSetup } from './setup/_ad-engine-runner.setup';
import { BaseContextSetup } from './setup/_base-context.setup';
import { BiddersStateSetup } from './setup/_bidders-state.setup';
import { BillTheLizardSetup } from './setup/_bill-the-lizard.setup';
import { DynamicSlotsSetup } from './setup/_dynamic-slots.setup';
import { LabradorSetup } from './setup/_labrador.setup';
import { PrebidConfigSetup } from './setup/_prebid-config.setup';
import { SlotsContextSetup } from './setup/_slots-context.setup';
import { SlotsStateSetup } from './setup/_slots-state.setup';
import { TargetingSetup } from './setup/_targeting.setup';
import { TemplatesSetup } from './setup/_templates.setup';
import { WikiContextSetup } from './setup/_wiki-context.setup';
import { TrackingSetup } from './tracking/tracking.setup';

export interface PlatformStartupArgs {
	isMobile: boolean;
}

export const adEngineConfigured = globalAction('[AdEngine] Configured');

@Injectable()
export class PlatformStartup {
	constructor(
		private wikiContextSetup: WikiContextSetup,
		private baseContextSetup: BaseContextSetup,
		private targetingSetup: TargetingSetup,
		private slotsContextSetup: SlotsContextSetup,
		private prebidConfigSetup: PrebidConfigSetup,
		private a9ConfigSetup: A9ConfigSetup,
		private billTheLizardSetup: BillTheLizardSetup,
		private labradorSetup: LabradorSetup,
		private slotsStateSetup: SlotsStateSetup,
		private biddersStateSetup: BiddersStateSetup,
		private dynamicSlotsSetup: DynamicSlotsSetup,
		private templatesSetup: TemplatesSetup,
		private trackingSetup: TrackingSetup,
		private adEngineRunnerSetup: AdEngineRunnerSetup,
		private noAdsMode: NoAdsMode,
		private adsMode: AdsMode,
	) {}

	configure(args: PlatformStartupArgs): void {
		this.wikiContextSetup.configureWikiContext();
		this.baseContextSetup.configureBaseContext(args.isMobile);
		this.slotsContextSetup.configureSlotsContext();
		this.targetingSetup.configureTargetingContext();
		this.prebidConfigSetup.configurePrebidContext();
		this.a9ConfigSetup.configureA9Context();
		this.dynamicSlotsSetup.configureDynamicSlots();
		this.slotsStateSetup.configureSlotsState();
		this.biddersStateSetup.configureBiddersState();
		this.templatesSetup.configureTemplates();
		this.billTheLizardSetup.configure();
		this.labradorSetup.configure();
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

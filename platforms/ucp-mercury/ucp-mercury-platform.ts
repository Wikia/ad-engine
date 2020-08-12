import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	CommonBiddersStateSetup,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	once,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpMercuryAdsMode } from './modes/ucp-mercury-ads.mode';
import { UcpMercuryBaseContextSetup } from './setup/context/base/ucp-mercury-base-context.setup';
import { UcpMercurySlotsContextSetup } from './setup/context/slots/ucp-mercury-slots-context.setup';
import { UcpMercuryWikiContextSetup } from './setup/context/wiki/ucp-mercury-wiki-context.setup';
import { UcpMercuryDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mercury-dynamic-slots.setup';
import { UcpMercuryAfterTransitionSetup } from './setup/hooks/ucp-mercury-after-transition-setup';
import { UcpMercuryBeforeTransitionSetup } from './setup/hooks/ucp-mercury-before-transition-setup';
import { UcpMercuryOnTransitionSetup } from './setup/hooks/ucp-mercury-on-transition-setup';
import { UcpMercuryIocSetup } from './ucp-mercury-ioc-setup';

@Injectable()
export class UcpMercuryPlatform {
	static executed = false;

	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	setup(): void {
		// Config
		this.pipeline.add(
			once(() => context.extend(basicContext)),
			once(InstantConfigSetup),
			once(UcpMercuryIocSetup),
			UcpMercuryWikiContextSetup,
			UcpMercuryBaseContextSetup,
			UcpMercurySlotsContextSetup,
			UcpTargetingSetup,
			UcpMercuryDynamicSlotsSetup,
			CommonBiddersStateSetup,
			LabradorSetup,
			once(TrackingSetup),
			once(AdEngineRunnerSetup),
			once(() => {
				communicationService.dispatch(adEngineConfigured());
				UcpMercuryPlatform.executed = true;
			}),
			once(UcpMercuryBeforeTransitionSetup),
			once(UcpMercuryOnTransitionSetup),
			once(UcpMercuryAfterTransitionSetup),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpMercuryAdsMode,
				no: UcpNoAdsMode,
			}),
		);
	}

	execute(): void {
		this.pipeline.execute();
	}
}

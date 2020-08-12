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
	ProcessPipeline,
	sequential,
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

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			InstantConfigSetup,
			UcpMercuryIocSetup,
			UcpMercuryWikiContextSetup,
			UcpMercuryBaseContextSetup,
			UcpMercurySlotsContextSetup,
			UcpTargetingSetup,
			UcpMercuryDynamicSlotsSetup,
			CommonBiddersStateSetup,
			LabradorSetup,
			conditional(() => UcpMercuryPlatform.executed, {
				no: sequential(
					TrackingSetup,
					AdEngineRunnerSetup,
					() => {
						communicationService.dispatch(adEngineConfigured());
						UcpMercuryPlatform.executed = true;
					},
					UcpMercuryBeforeTransitionSetup,
					UcpMercuryOnTransitionSetup,
					UcpMercuryAfterTransitionSetup,
				),
			}),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpMercuryAdsMode,
				no: UcpNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}

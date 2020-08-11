import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	CommonBiddersStateSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
} from '@platforms/shared';
import { communicationService, conditional, context, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpMercuryAdsMode } from './modes/ucp-mercury-ads.mode';
import { UcpMercuryBaseContextSetup } from './setup/context/base/ucp-mercury-base-context.setup';
import { UcpMercurySlotsContextSetup } from './setup/context/slots/ucp-mercury-slots-context.setup';
import { UcpMercuryWikiContextSetup } from './setup/context/wiki/ucp-mercury-wiki-context.setup';
import { UcpMercuryDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mercury-dynamic-slots.setup';
import { UcpMercuryIocSetup } from './ucp-mercury-ioc-setup';

@Injectable()
export class UcpMercuryPlatform {
	static executed = false;

	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			UcpMercuryIocSetup,
			UcpMercuryWikiContextSetup,
			UcpMercuryBaseContextSetup,
			UcpMercurySlotsContextSetup,
			UcpTargetingSetup,
			UcpMercuryDynamicSlotsSetup,
			CommonBiddersStateSetup,
			LabradorSetup,
		);

		if (!UcpMercuryPlatform.executed) {
			this.pipeline.add(TrackingSetup, AdEngineRunnerSetup, () => {
				communicationService.dispatch(adEngineConfigured());
				UcpMercuryPlatform.executed = true;
			});
		}

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

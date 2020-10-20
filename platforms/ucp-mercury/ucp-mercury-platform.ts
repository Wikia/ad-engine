import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
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
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpMercuryAdsMode } from './modes/ucp-mercury-ads.mode';
import { UcpMercuryA9ConfigSetup } from './setup/context/a9/ucp-mercury-a9-config.setup';
import { UcpMercuryBaseContextSetup } from './setup/context/base/ucp-mercury-base-context.setup';
import { UcpMercuryPrebidConfigSetup } from './setup/context/prebid/ucp-mercury-prebid-config.setup';
import { UcpMercurySlotsContextSetup } from './setup/context/slots/ucp-mercury-slots-context.setup';
import { UcpMercuryWikiContextSetup } from './setup/context/wiki/ucp-mercury-wiki-context.setup';
import { UcpMercuryDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mercury-dynamic-slots.setup';
import { UcpMercuryTemplatesSetup } from './templates/ucp-mercury-templates-setup.service';
import { UcpMercuryIocSetup } from './ucp-mercury-ioc-setup';

@Injectable()
export class UcpMercuryPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpMercuryIocSetup,
			UcpMercuryWikiContextSetup,
			() => context.set('state.isMobile', true),
			UcpMercuryBaseContextSetup,
			UcpMercurySlotsContextSetup,
			UcpTargetingSetup,
			UcpMercuryPrebidConfigSetup,
			UcpMercuryA9ConfigSetup,
			UcpMercuryDynamicSlotsSetup,
			BiddersStateSetup,
			UcpMercuryTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
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

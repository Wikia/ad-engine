import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	CommonBiddersStateSetup,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	UcpBaseContextSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
	UcpWikiContextSetup,
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
import { UcpAdsMode } from './modes/ucp-ads.mode';
import { UcpA9ConfigSetup } from './setup/context/a9/a9';
import { UcpBillTheLizardSetup } from './setup/context/bill-the-lizard/bill-the-lizard.setup';
import { UcpPrebidConfigSetup } from './setup/context/prebid/ucp-prebid-config.setup';
import { UcpSlotsContextSetup } from './setup/context/slots/ucp-slots-context.setup';
import { UcpDynamicSlotsSetup } from './setup/dynamic-slots/ucp-dynamic-slots.setup';
import { UcpSlotsStateSetup } from './setup/state/slots/ucp-slots-state-setup';
import { UcpTemplatesSetup } from './templates/ucp-templates.setup';
import { UcpIocSetup } from './ucp-ioc-setup';

@Injectable()
export class UcpPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpIocSetup,
			UcpWikiContextSetup,
			() => context.set('state.isMobile', false),
			UcpBaseContextSetup,
			UcpSlotsContextSetup,
			UcpTargetingSetup,
			UcpPrebidConfigSetup,
			UcpA9ConfigSetup,
			UcpDynamicSlotsSetup,
			UcpSlotsStateSetup,
			CommonBiddersStateSetup,
			UcpTemplatesSetup,
			UcpBillTheLizardSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: UcpAdsMode,
				no: UcpNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}

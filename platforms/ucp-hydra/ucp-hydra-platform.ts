import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	CommonBiddersStateSetup,
	GamepediaA9ConfigSetup,
	InstantConfigSetup,
	LabradorSetup,
	NoAdsDetector,
	TrackingSetup,
	UcpBaseContextSetup,
	UcpGamepediaPrebidConfigSetup,
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
import { basicContext } from '../ucp/ad-context';
import { HydraAdsMode } from './modes/hydra-ads-mode';
import { HydraSlotsContextSetup } from './setup/context/slots/hydra-slots-context-setup';
import { HydraDynamicSlotsSetup } from './setup/dynamic-slots/hydra-dynamic-slots-setup';
import { HydraSlotsStateSetup } from './setup/state/slots/hydra-slots-state-setup';
import { UcpHydraTemplatesSetup } from './templates/ucp-hydra-templates.setup';
import { UcpHydraIocSetup } from './ucp-hydra-ioc-setup';

export class UcpHydraPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpHydraIocSetup,
			UcpWikiContextSetup,
			() => context.set('state.isMobile', false),
			UcpBaseContextSetup,
			HydraSlotsContextSetup,
			UcpTargetingSetup,
			UcpGamepediaPrebidConfigSetup,
			GamepediaA9ConfigSetup,
			HydraDynamicSlotsSetup,
			HydraSlotsStateSetup,
			CommonBiddersStateSetup,
			UcpHydraTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: HydraAdsMode,
				no: UcpNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}

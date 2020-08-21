import {
	adEngineConfigured,
	AdEngineRunnerSetup,
	BiddersStateSetup,
	bootstrapAndGetConsent,
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
import { basicContext } from './ad-context';
import { MinervaAdsMode } from './modes/minerva-ads-mode';
import { MinervaSlotsContextSetup } from './setup/context/slots/minerva-slots-context-setup';
import { MinervaDynamicSlotsSetup } from './setup/dynamic-slots/minerva-dynamic-slots-setup';
import { MinervaSlotsStateSetup } from './setup/state/slots/minerva-slots-state-setup';
import { UcpMinervaTemplatesSetup } from './templates/ucp-minerva-templates.setup';
import { UcpMinervaIocSetup } from './ucp-minerva-ioc-setup';

export class UcpMinervaPlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpMinervaIocSetup,
			UcpWikiContextSetup,
			() => context.set('state.isMobile', true),
			UcpBaseContextSetup,
			MinervaSlotsContextSetup,
			UcpTargetingSetup,
			UcpGamepediaPrebidConfigSetup,
			GamepediaA9ConfigSetup,
			MinervaDynamicSlotsSetup,
			MinervaSlotsStateSetup,
			BiddersStateSetup,
			UcpMinervaTemplatesSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.dispatch(adEngineConfigured()),
		);

		// Run
		this.pipeline.add(
			conditional(() => this.noAdsDetector.isAdsMode(), {
				yes: MinervaAdsMode,
				no: UcpNoAdsMode,
			}),
		);

		this.pipeline.execute();
	}
}

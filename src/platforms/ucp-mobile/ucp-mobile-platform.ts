import {
	AdEngineRunnerSetup,
	BiddersStateSetup,
	bootstrap,
	ConsentManagementPlatformSetup,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	MetricReporterSetup,
	NoAdsDetector,
	NoAdsExperimentSetup,
	NoAdsMode,
	PlatformContextSetup,
	PreloadedLibrariesSetup,
	SequentialMessagingSetup,
	TrackingParametersSetup,
	TrackingSetup,
	UcpTargetingSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	domContentLoadedPhase,
	eventsRepository,
	IdentitySetup,
	pageLoadPhase,
	parallel,
	ProcessPipeline,
	sequential,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpMobileAdsMode } from './modes/ucp-mobile-ads.mode';
import { UcpMobileA9ConfigSetup } from './setup/context/a9/ucp-mobile-a9-config.setup';
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobilePrebidConfigSetup } from './setup/context/prebid/ucp-mobile-prebid-config.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileDynamicSlotsSetup } from './setup/dynamic-slots/ucp-mobile-dynamic-slots.setup';
import { UcpMobileExperimentsSetup } from './setup/experiments/ucp-mobile-experiments.setup';
import { UcpMobileTemplatesSetup } from './templates/ucp-mobile-templates.setup';

@Injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline, private noAdsDetector: NoAdsDetector) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', true),
			PlatformContextSetup,
			domContentLoadedPhase(
				() => bootstrap(),
				parallel(
					sequential(InstantConfigSetup, PreloadedLibrariesSetup),
					ConsentManagementPlatformSetup,
				),
			),
			TrackingParametersSetup,
			MetricReporterSetup,
			UcpMobileBaseContextSetup,
			UcpMobileSlotsContextSetup,
			IdentitySetup,
			UcpTargetingSetup,
			LoadTimesSetup,
			UcpMobilePrebidConfigSetup,
			UcpMobileA9ConfigSetup,
			UcpMobileDynamicSlotsSetup,
			UcpMobileTemplatesSetup,
			SequentialMessagingSetup, // SequentialMessagingSetup needs to be after *TemplatesSetup or UAP SM will break
			BiddersStateSetup,
			pageLoadPhase(
				conditional(() => this.noAdsDetector.isAdsMode(), {
					yes: UcpMobileAdsMode,
					no: NoAdsMode,
				}),
				NoAdsExperimentSetup,
				LabradorSetup,
				UcpMobileExperimentsSetup,
				TrackingSetup,
				AdEngineRunnerSetup,
				() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			),
		);

		this.pipeline.execute();
	}
}

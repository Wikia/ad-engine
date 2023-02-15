import {
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	LoadTimesSetup,
	NoAdsExperimentSetup,
	PlatformContextSetup,
	shouldUseAdLayouts,
	TrackingParametersSetup,
	TrackingSetup,
	UcpTargetingSetup,
} from '@platforms/shared';
import {
	communicationService,
	conditional,
	context,
	eventsRepository,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpDesktopBaseContextSetup } from './setup/context/base/ucp-desktop-base-context.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopAdLayoutSetup } from './ucp-desktop-ad-layout-setup';
import { UcpDesktopLegacySetup } from './ucp-desktop-legacy-setup';

@Injectable()
export class UcpDesktopPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			LoadTimesSetup,
			UcpDesktopBaseContextSetup,
			UcpDesktopSlotsContextSetup,
			UcpTargetingSetup,
			conditional(shouldUseAdLayouts, {
				yes: UcpDesktopAdLayoutSetup,
				no: UcpDesktopLegacySetup,
			}),
			NoAdsExperimentSetup,
			LabradorSetup,
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.execute();
	}
}

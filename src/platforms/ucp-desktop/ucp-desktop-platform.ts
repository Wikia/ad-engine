import {
	AdEngineRunnerSetup,
	InstantConfigSetup,
	NoAdsExperimentSetup,
	LabradorSetup,
	LoadTimesSetup,
	shouldUseAdLayouts,
	TrackingParametersSetup,
	TrackingSetup,
	UcpTargetingSetup,
	PlatformContextSetup,
} from '@platforms/shared';
import {
	Bootstrap,
	communicationService,
	conditional,
	eventsRepository,
	parallel,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpDesktopBaseContextSetup } from './setup/context/base/ucp-desktop-base-context.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopIocSetup } from './ucp-desktop-ioc-setup';
import { UcpDesktopAdLayoutSetup } from './ucp-desktop-ad-layout-setup';
import { UcpDesktopLegacySetup } from './ucp-desktop-legacy-setup';

@Injectable()
export class UcpDesktopPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => Bootstrap.setupContextAndGeo(basicContext),
			PlatformContextSetup,
			parallel(InstantConfigSetup, Bootstrap.setupConsent),
			TrackingParametersSetup,
			LoadTimesSetup,
			UcpDesktopIocSetup,
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

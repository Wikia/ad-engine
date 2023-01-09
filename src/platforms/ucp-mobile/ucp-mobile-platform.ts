import {
	AdEngineRunnerSetup,
	InstantConfigSetup,
	NoAdsExperimentSetup,
	LabradorSetup,
	TrackingParametersSetup,
	TrackingSetup,
	UcpTargetingSetup,
	PlatformContextSetup,
	shouldUseAdLayouts,
	LoadTimesSetup,
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
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileIocSetup } from './ucp-mobile-ioc-setup';
import { UcpMobileAdLayoutSetup } from './ucp-mobile-ad-layout-setup';
import { UcpMobileLegacySetup } from './ucp-mobile-legacy-setup';

@Injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => Bootstrap.setupContext(basicContext, true),
			Bootstrap.setupGeo,
			PlatformContextSetup,
			parallel(InstantConfigSetup, Bootstrap.setupConsent),
			TrackingParametersSetup,
			LoadTimesSetup,
			UcpMobileIocSetup,
			UcpMobileBaseContextSetup,
			UcpMobileSlotsContextSetup,
			UcpTargetingSetup,
			conditional(shouldUseAdLayouts, {
				yes: UcpMobileAdLayoutSetup,
				no: UcpMobileLegacySetup,
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

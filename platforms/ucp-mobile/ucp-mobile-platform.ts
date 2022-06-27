import {
	AdEngineRunnerSetup,
	bootstrapAndGetConsent,
	InstantConfigSetup,
	LabradorSetup,
	TrackingSetup,
	UcpTargetingSetup,
	PlatformContextSetup,
	shouldUseAdLayouts,
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
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileIocSetup } from './ucp-mobile-ioc-setup';
import { NoAdsExperimentSetup } from '../shared/setup/noads-experiment.setup';
import { UcpMobileAdLayoutSetup } from './ucp-mobile-ad-layout-setup';
import { UcpMobileLegacySetup } from './ucp-mobile-legacy-setup';
import { TrackingParametersSetup } from '../shared/setup/tracking-parameters.setup';

@Injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			UcpMobileIocSetup,
			TrackingParametersSetup,
			() => context.set('state.isMobile', true),
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

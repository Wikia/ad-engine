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
import { injectable } from 'tsyringe';
import { basicContext } from './ad-context';
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileAdLayoutSetup } from './ucp-mobile-ad-layout-setup';
import { UcpMobileIocSetup } from './ucp-mobile-ioc-setup';
import { UcpMobileLegacySetup } from './ucp-mobile-legacy-setup';

@injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			LoadTimesSetup,
			UcpMobileIocSetup,
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

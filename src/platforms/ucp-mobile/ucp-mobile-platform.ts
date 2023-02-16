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
	UserIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { UcpMobileBaseContextSetup } from './setup/context/base/ucp-mobile-base-context.setup';
import { UcpMobileSlotsContextSetup } from './setup/context/slots/ucp-mobile-slots-context.setup';
import { UcpMobileAdLayoutSetup } from './ucp-mobile-ad-layout-setup';
import { UcpMobileLegacySetup } from './ucp-mobile-legacy-setup';

@Injectable()
export class UcpMobilePlatform {
	constructor(private pipeline: ProcessPipeline, private userIdentity: UserIdentity) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('state.isMobile', true),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
			TrackingParametersSetup,
			LoadTimesSetup,
			UcpMobileBaseContextSetup,
			UcpMobileSlotsContextSetup,
			UcpTargetingSetup,
			conditional(shouldUseAdLayouts, {
				yes: UcpMobileAdLayoutSetup,
				no: UcpMobileLegacySetup,
			}),
			NoAdsExperimentSetup,
			LabradorSetup,
			// ToDo: Remove after ADEN-12559.
			() => this.userIdentity.call(),
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.execute();
	}
}

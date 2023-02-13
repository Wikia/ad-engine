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
import { UcpDesktopBaseContextSetup } from './setup/context/base/ucp-desktop-base-context.setup';
import { UcpDesktopSlotsContextSetup } from './setup/context/slots/ucp-desktop-slots-context.setup';
import { UcpDesktopAdLayoutSetup } from './ucp-desktop-ad-layout-setup';
import { UcpDesktopIocSetup } from './ucp-desktop-ioc-setup';
import { UcpDesktopLegacySetup } from './ucp-desktop-legacy-setup';

@Injectable()
export class UcpDesktopPlatform {
	constructor(private pipeline: ProcessPipeline, private userIdentity: UserIdentity) {}

	execute(): void {
		// Config
		this.pipeline.add(
			() => context.extend(basicContext),
			PlatformContextSetup,
			parallel(InstantConfigSetup, () => bootstrapAndGetConsent()),
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
			// ToDo: Remove after ADEN-12559.
			() => this.userIdentity.call(),
			TrackingSetup,
			AdEngineRunnerSetup,
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
		);

		this.pipeline.execute();
	}
}

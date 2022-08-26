import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	DiProcess,
	PartnerPipeline,
	eventsRepository,
	facebookPixelDeprecated,
	iasPublisherOptimizationDeprecated,
	identityHubDeprecated,
	nielsenDeprecated,
	silverSurferServiceDeprecated,
	stroerDeprecated,
	taxonomyServiceDeprecated,
	audigentDeprecated,
	confiantDeprecated,
	userIdentityDeprecated,
	atsDeprecated,
} from '@wikia/ad-engine';
import { gptDeprecatedSetup, playerDeprecatedSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentityDeprecated,
				atsDeprecated,
				taxonomyServiceDeprecated,
				silverSurferServiceDeprecated,
				facebookPixelDeprecated,
				audigentDeprecated,
				iasPublisherOptimizationDeprecated,
				confiantDeprecated,
				stroerDeprecated,
				nielsenDeprecated,
				identityHubDeprecated,
				playerDeprecatedSetup.setOptions({
					dependencies: [
						taxonomyServiceDeprecated.initialized,
						silverSurferServiceDeprecated.initialized,
					],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				gptDeprecatedSetup.setOptions({
					dependencies: [userIdentityDeprecated.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

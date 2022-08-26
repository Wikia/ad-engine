import { Injectable } from '@wikia/dependency-injection';
import {
	adMarketplaceDeprecated,
	atsDeprecated,
	audigentDeprecated,
	biddersDeprecated,
	communicationService,
	confiantDeprecated,
	context,
	DiProcess,
	durationMediaDeprecated,
	eventsRepository,
	facebookPixelDeprecated,
	iasPublisherOptimizationDeprecated,
	identityHubDeprecated,
	liveConnectDeprecated,
	nielsenDeprecated,
	PartnerPipeline,
	silverSurferServiceDeprecated,
	stroerDeprecated,
	taxonomyServiceDeprecated,
	userIdentityDeprecated,
} from '@wikia/ad-engine';
import { gptDeprecatedSetup, playerDeprecatedSetup } from '@platforms/shared';

@Injectable()
export class UcpMobileLighterAds implements DiProcess {
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
				durationMediaDeprecated,
				liveConnectDeprecated,
				adMarketplaceDeprecated,
				stroerDeprecated,
				biddersDeprecated,
				nielsenDeprecated,
				identityHubDeprecated,
				playerDeprecatedSetup.setOptions({
					dependencies: [
						biddersDeprecated.initialized,
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

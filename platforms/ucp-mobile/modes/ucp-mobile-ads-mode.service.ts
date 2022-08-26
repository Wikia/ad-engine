import { Injectable } from '@wikia/dependency-injection';
import {
	audigentDeprecated,
	communicationService,
	confiantDeprecated,
	context,
	DiProcess,
	durationMediaDeprecated,
	eventsRepository,
	eyeotaDeprecated,
	facebookPixelDeprecated,
	iasPublisherOptimizationDeprecated,
	identityHubDeprecated,
	liveConnectDeprecated,
	nielsenDeprecated,
	PartnerPipeline,
	prebidNativeProviderDeprecated,
	silverSurferServiceDeprecated,
	stroerDeprecated,
	taxonomyServiceDeprecated,
	adMarketplaceDeprecated,
	userIdentityDeprecated,
	atsDeprecated,
	biddersDeprecated,
} from '@wikia/ad-engine';
import { playerDeprecatedSetup, gptDeprecatedSetup, wadRunnerDeprecated } from '@platforms/shared';

@Injectable()
export class UcpMobileAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentityDeprecated,
				atsDeprecated,
				audigentDeprecated,
				biddersDeprecated,
				liveConnectDeprecated,
				facebookPixelDeprecated,
				taxonomyServiceDeprecated,
				silverSurferServiceDeprecated,
				wadRunnerDeprecated,
				eyeotaDeprecated,
				iasPublisherOptimizationDeprecated,
				confiantDeprecated,
				durationMediaDeprecated,
				stroerDeprecated,
				identityHubDeprecated,
				nielsenDeprecated,
				adMarketplaceDeprecated,
				prebidNativeProviderDeprecated,
				playerDeprecatedSetup.setOptions({
					dependencies: [
						biddersDeprecated.initialized,
						taxonomyServiceDeprecated.initialized,
						silverSurferServiceDeprecated.initialized,
						wadRunnerDeprecated.initialized,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
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

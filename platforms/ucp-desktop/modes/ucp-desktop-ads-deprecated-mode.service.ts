import { Injectable } from '@wikia/dependency-injection';
import {
	audigentDeprecated,
	communicationService,
	confiantDeprecated,
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
	utils,
	context,
	biddersDeprecated,
	testService,
	preTestService,
} from '@wikia/ad-engine';
import {
	wadRunnerDeprecated,
	playerDeprecatedSetup,
	gptDeprecatedSetup,
	playerExperimentDeprecatedSetup,
} from '@platforms/shared';

@Injectable()
export class UcpDesktopAdsDeprecatedMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		utils.logger('DJ', 'Init v1');
		this.pipeline
			.add(
				testService,
				preTestService,
				userIdentityDeprecated,
				playerExperimentDeprecatedSetup,
				silverSurferServiceDeprecated,
				playerDeprecatedSetup.setOptions({
					dependencies: [
						biddersDeprecated.initialized,
						taxonomyServiceDeprecated.initialized,
						silverSurferServiceDeprecated.initialized,
						wadRunnerDeprecated.initialized,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				atsDeprecated,
				audigentDeprecated,
				biddersDeprecated,
				liveConnectDeprecated,
				facebookPixelDeprecated,
				taxonomyServiceDeprecated,
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
				gptDeprecatedSetup,
			)
			.execute()
			.then(() => {
				utils.logger('DJ', 'Pipeline completed');
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	eventsRepository,
	eyeota,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	optimera,
	PartnerPipeline,
	prebidNativeProvider,
	silverSurferService,
	stroer,
	taxonomyService,
	adMarketplace,
	userIdentity,
} from '@wikia/ad-engine';
import { playerSetup, gptSetup, wadRunner } from '@platforms/shared';

@Injectable()
export class UcpMobileAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				bidders,
				liveConnect,
				facebookPixel,
				taxonomyService,
				optimera,
				silverSurferService,
				wadRunner,
				audigent,
				eyeota,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				stroer,
				identityHub,
				nielsen,
				adMarketplace,
				prebidNativeProvider,
				playerSetup.setOptions({
					dependencies: [
						bidders.initialized,
						optimera.initialized,
						taxonomyService.initialized,
						silverSurferService.initialized,
						wadRunner.initialized,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [userIdentity.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

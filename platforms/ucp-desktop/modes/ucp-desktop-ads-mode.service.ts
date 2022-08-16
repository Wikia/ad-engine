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
	adIdentity,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, playerExperimentSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				adIdentity,
				playerExperimentSetup,
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
					dependencies: [adIdentity.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

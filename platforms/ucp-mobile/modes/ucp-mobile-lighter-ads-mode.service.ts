import { Injectable } from '@wikia/dependency-injection';
import {
	adMarketplace,
	ats,
	audigent,
	bidders,
	communicationService,
	confiant,
	DiProcess,
	durationMedia,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	ServicePipeline,
	silverSurferService,
	stroer,
	taxonomyService,
	userIdentity,
} from '@wikia/ad-engine';
import { gptSetup, playerSetup, wadRunner, adEngineSetup } from '@platforms/shared';

@Injectable()
export class UcpMobileLighterAds implements DiProcess {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				ats,
				taxonomyService,
				silverSurferService,
				facebookPixel,
				audigent,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				liveConnect,
				adMarketplace,
				stroer,
				bidders,
				nielsen,
				identityHub,
				playerSetup,
				gptSetup,
				adEngineSetup,
				wadRunner,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

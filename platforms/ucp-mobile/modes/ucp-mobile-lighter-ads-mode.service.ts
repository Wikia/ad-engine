import { Injectable } from '@wikia/dependency-injection';
import {
	adMarketplace,
	ats,
	audigent,
	bidders,
	communicationService,
	confiant,
	durationMedia,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	ServicePipeline,
	stroer,
	userIdentity,
} from '@wikia/ad-engine';
import { adEngineSetup, gptSetup, playerSetup } from '@platforms/shared';

@Injectable()
export class UcpMobileLighterAds {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				ats,
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
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

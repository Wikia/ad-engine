import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	nielsen,
	stroer,
	audigent,
	confiant,
	userIdentity,
	ats,
	ServicePipeline,
} from '@wikia/ad-engine';
import { adEngineSetup, gptSetup, playerSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopLighterAdsMode {
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
				stroer,
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

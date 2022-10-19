import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	durationMedia,
	eventsRepository,
	eyeota,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	ServicePipeline,
	prebidNativeProvider,
	stroer,
	userIdentity,
	ats,
	liveRampPixel,
} from '@wikia/ad-engine';
import {
	wadRunner,
	playerSetup,
	gptSetup,
	playerExperimentSetup,
	adEngineSetup,
} from '@platforms/shared';

@Injectable()
export class UcpDesktopAdsMode {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel,
				playerExperimentSetup,
				ats,
				audigent,
				bidders,
				liveConnect,
				facebookPixel,
				wadRunner,
				eyeota,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				stroer,
				identityHub,
				nielsen,
				prebidNativeProvider,
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

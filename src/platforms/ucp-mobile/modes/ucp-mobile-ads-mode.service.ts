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
	prebidNativeProvider,
	stroer,
	userIdentity,
	ats,
	ServicePipeline,
	liveRampPixel,
} from '@wikia/ad-engine';
import { playerSetup, gptSetup, wadRunner, adEngineSetup } from '@platforms/shared';

@Injectable()
export class UcpMobileAdsMode {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel,
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

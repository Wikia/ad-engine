import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	DiProcess,
	eventsRepository,
	ServicePipeline,
	userIdentity,
	ats,
	audigent,
	bidders,
	liveConnect,
	facebookPixel,
	eyeota,
	iasPublisherOptimization,
	confiant,
	durationMedia,
	identityHub,
	nielsen,
	stroer,
	adMarketplace,
	prebidNativeProvider,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, adEngineSetup } from '@platforms/shared';

@Injectable()
export class UcpMobileAdsMode implements DiProcess {
	constructor(private pipeline: ServicePipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
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
				adMarketplace,
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

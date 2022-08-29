import { Injectable } from '@wikia/dependency-injection';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	DiProcess,
	durationMedia,
	eventsRepository,
	eyeota,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	liveConnect,
	nielsen,
	prebidNativeProvider,
	silverSurferService,
	stroer,
	adMarketplace,
	ats,
	userIdentity,
	taxonomyService,
	PartnerPipeline,
} from '@wikia/ad-engine';
import {
	wadRunner,
	playerSetup,
	gptSetup,
	playerExperimentSetup,
	adEngineSetup,
} from '@platforms/shared';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				playerExperimentSetup,
				playerSetup,
				silverSurferService,
				ats,
				audigent,
				bidders,
				liveConnect,
				facebookPixel,
				taxonomyService,
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
				gptSetup,
				adEngineSetup,
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

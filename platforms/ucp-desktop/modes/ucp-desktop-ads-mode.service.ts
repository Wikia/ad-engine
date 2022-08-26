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
	PartnerPipeline,
	prebidNativeProvider,
	silverSurferService,
	stroer,
	taxonomyService,
	adMarketplace,
	userIdentity,
	ats,
	testService,
	preTestService,
	utils,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup, playerExperimentSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		this.pipeline
			.add(
				testService,
				preTestService,
				userIdentity,
				playerExperimentSetup,
				ats,
				audigent,
				bidders,
				liveConnect,
				facebookPixel,
				taxonomyService,
				silverSurferService,
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
			)
			.execute()
			.then(() => {
				utils.logger('DJ', 'Pipeline completed');
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

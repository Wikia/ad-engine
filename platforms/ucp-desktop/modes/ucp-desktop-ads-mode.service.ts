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
	utils,
	userIdentity,
	taxonomyService,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { wadRunner, playerSetup, gptSetup } from '@platforms/shared';
import { playerExperimentSetup } from '../../shared/setup/player-experiment.setup';
import { adEngineSetup } from '../../shared/setup/ad-engine.setup';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

	execute(): void {
		utils.logger('DJ', 'Init v2');
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
				utils.logger('DJ', 'Pipeline completed');
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

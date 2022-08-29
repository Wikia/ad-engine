import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	DiProcess,
	eventsRepository,
	PartnerPipeline,
	userIdentity,
	ats,
	taxonomyService,
	silverSurferService,
	facebookPixel,
	audigent,
	iasPublisherOptimization,
	confiant,
	stroer,
	nielsen,
	identityHub,
} from '@wikia/ad-engine';
import { gptSetup, playerSetup } from '@platforms/shared';
import { adEngineSetup } from '../../shared/setup/ad-engine.setup';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

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

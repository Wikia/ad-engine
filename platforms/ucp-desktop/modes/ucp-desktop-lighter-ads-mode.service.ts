import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	DiProcess,
	PartnerPipeline,
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
	jwPlayerInhibitor,
} from '@wikia/ad-engine';
import { gptSetup, playerSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline) {}

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
				playerSetup.setOptions({
					dependencies: [],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [
						userIdentity.initialized,
						playerSetup.initialized,
						jwPlayerInhibitor.initialized,
					],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

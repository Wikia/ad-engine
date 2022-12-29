import { Injectable } from '@wikia/dependency-injection';
import {
	Captify,
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
	liveRampPixel,
} from '@wikia/ad-engine';
import { gptSetup, playerSetup } from '@platforms/shared';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private captify: Captify) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel,
				ats,
				facebookPixel,
				audigent,
				iasPublisherOptimization,
				confiant,
				this.captify,
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
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						iasPublisherOptimization.IASReady,
					],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

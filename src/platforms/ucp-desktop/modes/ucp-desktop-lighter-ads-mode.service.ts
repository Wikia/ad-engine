import { gptSetup, playerSetup } from '@platforms/shared';
import {
	ats,
	audigent,
	Captify,
	communicationService,
	confiant,
	context,
	DiProcess,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	jwPlayerInhibitor,
	liveRampPixel,
	Nielsen,
	PartnerPipeline,
	Stroer,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private captify: Captify,
		private nielsen: Nielsen,
		private stroer: Stroer,
	) {}

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
				this.stroer,
				this.nielsen,
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

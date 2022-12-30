import { gptSetup, playerSetup } from '@platforms/shared';
import {
	ats,
	audigent,
	bidders,
	Captify,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	eventsRepository,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	jwPlayerInhibitor,
	liveConnect,
	liveRampPixel,
	Nielsen,
	PartnerPipeline,
	Stroer,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileLighterAds implements DiProcess {
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
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				ats,
				facebookPixel,
				audigent,
				iasPublisherOptimization,
				this.captify,
				confiant,
				durationMedia,
				liveConnect,
				this.stroer,
				bidders,
				this.nielsen,
				identityHub,
				playerSetup.setOptions({
					dependencies: [bidders.initialized],
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

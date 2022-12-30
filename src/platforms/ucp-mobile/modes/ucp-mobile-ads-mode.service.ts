import { gptSetup, playerSetup, wadRunner } from '@platforms/shared';
import {
	Ats,
	audigent,
	bidders,
	Captify,
	communicationService,
	Confiant,
	context,
	DiProcess,
	DurationMedia,
	eventsRepository,
	Eyeota,
	FacebookPixel,
	iasPublisherOptimization,
	identityHub,
	jwPlayerInhibitor,
	liveConnect,
	liveRampPixel,
	Nielsen,
	PartnerPipeline,
	prebidNativeProvider,
	Stroer,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private ats: Ats,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
		private facebookPixel: FacebookPixel,
		private eyeota: Eyeota,
		private nielsen: Nielsen,
		private stroer: Stroer,
	) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				this.ats,
				audigent,
				bidders,
				this.captify,
				liveConnect,
				this.facebookPixel,
				wadRunner,
				this.eyeota,
				iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				identityHub,
				this.nielsen,
				prebidNativeProvider,
				playerSetup.setOptions({
					dependencies: [bidders.initialized, wadRunner.initialized],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				gptSetup.setOptions({
					dependencies: [
						jwPlayerInhibitor.initialized,
						userIdentity.initialized,
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

import { anyclipPlayerSetup, gptSetup, playerSetup, wadRunner } from '@platforms/shared';
import {
	Ats,
	audigent,
	bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DurationMedia,
	eventsRepository,
	Eyeota,
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
export class UcpDesktopAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private ats: Ats,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
		private eyeota: Eyeota,
		private nielsen: Nielsen,
		private stroer: Stroer,
	) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				anyclipPlayerSetup,
				this.ats,
				audigent,
				bidders,
				liveConnect,
				wadRunner,
				this.eyeota,
				iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				identityHub,
				this.captify,
				this.nielsen,
				prebidNativeProvider,
				playerSetup.setOptions({
					dependencies: [bidders.initialized, wadRunner.initialized],
				}),
				gptSetup.setOptions({
					dependencies: [
						userIdentity.initialized,
						playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						iasPublisherOptimization.IASReady,
					],
					timeout: jwPlayerInhibitor.isRequiredToRun()
						? jwPlayerInhibitor.getDelayTimeoutInMs()
						: null,
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

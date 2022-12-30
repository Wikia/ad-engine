import { anyclipPlayerSetup, gptSetup, playerSetup, wadRunner } from '@platforms/shared';
import {
	ats,
	audigent,
	bidders,
	Captify,
	communicationService,
	confiant,
	DiProcess,
	durationMedia,
	eventsRepository,
	eyeota,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	jwPlayerInhibitor,
	liveConnect,
	liveRampPixel,
	nielsen,
	PartnerPipeline,
	prebidNativeProvider,
	stroer,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private captify: Captify) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				anyclipPlayerSetup,
				ats,
				audigent,
				bidders,
				liveConnect,
				facebookPixel,
				wadRunner,
				eyeota,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				stroer,
				identityHub,
				this.captify,
				nielsen,
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

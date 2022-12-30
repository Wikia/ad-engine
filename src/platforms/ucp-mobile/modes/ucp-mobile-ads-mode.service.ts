import { gptSetup, playerSetup, wadRunner } from '@platforms/shared';
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
export class UcpMobileAdsMode implements DiProcess {
	constructor(private pipeline: PartnerPipeline, private captify: Captify) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel.setOptions({ dependencies: [userIdentity.initialized] }),
				ats,
				audigent,
				bidders,
				this.captify,
				liveConnect,
				facebookPixel,
				wadRunner,
				eyeota,
				iasPublisherOptimization,
				confiant,
				durationMedia,
				stroer,
				identityHub,
				nielsen,
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

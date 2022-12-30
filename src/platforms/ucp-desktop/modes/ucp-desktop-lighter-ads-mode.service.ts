import { gptSetup, playerSetup } from '@platforms/shared';
import {
	Ats,
	audigent,
	Captify,
	communicationService,
	Confiant,
	context,
	DiProcess,
	eventsRepository,
	FacebookPixel,
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
		private ats: Ats,
		private captify: Captify,
		private confiant: Confiant,
		private facebookPixel: FacebookPixel,
		private nielsen: Nielsen,
		private stroer: Stroer,
	) {}

	execute(): void {
		this.pipeline
			.add(
				userIdentity,
				liveRampPixel,
				this.ats,
				this.facebookPixel,
				audigent,
				iasPublisherOptimization,
				this.confiant,
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

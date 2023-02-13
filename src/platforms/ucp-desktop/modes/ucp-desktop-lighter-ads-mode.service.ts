import { GptSetup, PlayerSetup } from '@platforms/shared';
import {
	Ats,
	Audigent,
	Captify,
	communicationService,
	Confiant,
	context,
	DiProcess,
	eventsRepository,
	IasPublisherOptimization,
	IdentityHub,
	jwPlayerInhibitor,
	LiveConnect,
	LiveRampPixel,
	Nielsen,
	PartnerPipeline,
	Stroer,
	UserIdentity,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private ats: Ats,
		private audigent: Audigent,
		private captify: Captify,
		private confiant: Confiant,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private identityHub: IdentityHub,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private nielsen: Nielsen,
		private playerSetup: PlayerSetup,
		private stroer: Stroer,
		private userIdentity: UserIdentity,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.userIdentity,
				this.liveRampPixel,
				this.ats,
				this.audigent,
				this.iasPublisherOptimization,
				this.confiant,
				this.liveConnect,
				this.captify,
				this.stroer,
				this.nielsen,
				this.identityHub,
				this.playerSetup.setOptions({
					dependencies: [],
					timeout: context.get('options.maxDelayTimeout'),
				}),
				this.gptSetup.setOptions({
					dependencies: [
						this.userIdentity.initialized,
						this.playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						this.iasPublisherOptimization.IASReady,
					],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

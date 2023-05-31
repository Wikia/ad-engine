import { GptSetup, PlayerSetup, WadRunner } from '@platforms/shared';
import {
	Captify,
	communicationService,
	context,
	DiProcess,
	DoubleVerify,
	eventsRepository,
	IasPublisherOptimization,
	IdentitySetup,
	jwPlayerInhibitor,
	Nielsen,
	PartnerPipeline,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class F2AdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private captify: Captify,
		private doubleVerify: DoubleVerify,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private identitySetup: IdentitySetup,
		private nielsen: Nielsen,
		private playerSetup: PlayerSetup,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.captify,
				this.iasPublisherOptimization,
				this.nielsen,
				this.wadRunner,
				this.identitySetup,
				this.playerSetup.setOptions({
					dependencies: [this.wadRunner.initialized],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				this.gptSetup.setOptions({
					dependencies: [
						this.playerSetup.initialized,
						jwPlayerInhibitor.isRequiredToRun() ? jwPlayerInhibitor.initialized : Promise.resolve(),
						this.iasPublisherOptimization.IASReady,
					],
					timeout: context.get('options.jwpMaxDelayTimeout'),
				}),
				this.doubleVerify.setOptions({
					dependencies: [this.gptSetup.initialized],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

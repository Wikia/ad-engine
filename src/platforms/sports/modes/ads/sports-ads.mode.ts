import { GptSetup, WadRunner } from '@platforms/shared';
import {
	Audigent,
	Bidders,
	Captify,
	communicationService,
	Confiant,
	DiProcess,
	DurationMedia,
	eventsRepository,
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	PartnerPipeline,
	UserIdentity,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class SportsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private durationMedia: DurationMedia,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private userIdentity: UserIdentity,
		private wadRunner: WadRunner,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.userIdentity,
				this.liveRampPixel.setOptions({
					dependencies: [this.userIdentity.initialized],
				}),
				this.liveConnect,
				this.bidders,
				this.captify,
				this.wadRunner,
				this.audigent,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.gptSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
						this.userIdentity.initialized,
						this.wadRunner.initialized,
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

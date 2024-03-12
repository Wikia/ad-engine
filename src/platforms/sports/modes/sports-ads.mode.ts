import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { AdEngineStackSetup, GptSetup, WadRunner } from '@platforms/shared';
import { Bidders } from '@wikia/ad-bidders';
import {
	Audigent,
	Captify,
	Confiant,
	DoubleVerify,
	DurationMedia,
	Experian,
	IasPublisherOptimization,
	LiveConnect,
	LiveRampPixel,
	Lotame,
} from '@wikia/ad-services';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private adEngineStackSetup: AdEngineStackSetup,
		private audigent: Audigent,
		private bidders: Bidders,
		private captify: Captify,
		private confiant: Confiant,
		private doubleVerify: DoubleVerify,
		private durationMedia: DurationMedia,
		private experian: Experian,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private liveConnect: LiveConnect,
		private liveRampPixel: LiveRampPixel,
		private wadRunner: WadRunner,
		private lotame: Lotame,
	) {}

	execute(): void {
		this.pipeline
			.add(
				this.lotame,
				this.liveRampPixel,
				this.liveConnect,
				this.experian,
				this.bidders,
				this.captify,
				this.wadRunner,
				this.audigent,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.gptSetup,
				this.doubleVerify,
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
						this.wadRunner.initialized,
						this.gptSetup.initialized,
					],
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
			});
	}
}

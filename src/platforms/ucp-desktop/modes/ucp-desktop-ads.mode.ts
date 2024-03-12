import { DiProcess, PartnerPipeline } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import {
	AdEngineStackSetup,
	GptSetup,
	JwpStrategyRulesSetup,
	PlayerSetup,
	WadRunner,
} from '@platforms/shared';
import { Bidders, PrebidNativeProvider } from '@wikia/ad-bidders';
import { videoDisplayTakeoverSynchronizer } from '@wikia/ad-products';
import {
	Anyclip,
	Ats,
	Audigent,
	Confiant,
	Connatix,
	DoubleVerify,
	DurationMedia,
	IasPublisherOptimization,
	OpenWeb,
	Stroer,
	System1,
	Wunderkind,
} from '@wikia/ad-services';
import { communicationService, eventsRepository } from '@wikia/communication';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
	constructor(
		private pipeline: PartnerPipeline,
		private adEngineStackSetup: AdEngineStackSetup,
		private anyclip: Anyclip,
		private ats: Ats,
		private audigent: Audigent,
		private bidders: Bidders,
		private confiant: Confiant,
		private connatix: Connatix,
		private doubleVerify: DoubleVerify,
		private durationMedia: DurationMedia,
		private gptSetup: GptSetup,
		private iasPublisherOptimization: IasPublisherOptimization,
		private jwpStrategyRules: JwpStrategyRulesSetup,
		private openWeb: OpenWeb,
		private playerSetup: PlayerSetup,
		private prebidNativeProvider: PrebidNativeProvider,
		private stroer: Stroer,
		private system1: System1,
		private wadRunner: WadRunner,
		private wunderkind: Wunderkind,
	) {}

	execute(): void {
		logger('partners-pipeline', 'starting');
		this.pipeline
			.add(
				this.jwpStrategyRules,
				this.anyclip,
				this.ats,
				this.audigent,
				this.bidders,
				this.connatix,
				this.wadRunner,
				this.iasPublisherOptimization,
				this.confiant,
				this.durationMedia,
				this.stroer,
				this.prebidNativeProvider,
				this.wunderkind,
				this.openWeb,
				this.system1,
				this.playerSetup.setOptions({
					dependencies: [this.bidders.initialized, this.wadRunner.initialized],
				}),
				this.gptSetup,
				this.doubleVerify,
				this.adEngineStackSetup.setOptions({
					dependencies: [
						this.bidders.initialized,
						this.wadRunner.initialized,
						this.gptSetup.initialized,
						videoDisplayTakeoverSynchronizer.isRequiredToRun()
							? videoDisplayTakeoverSynchronizer.initialized
							: Promise.resolve(),
					],
					timeout: videoDisplayTakeoverSynchronizer.isRequiredToRun()
						? videoDisplayTakeoverSynchronizer.getDelayTimeoutInMs()
						: null,
				}),
			)
			.execute()
			.then(() => {
				communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY);
				logger('partners-pipeline', 'finished');
			});
	}
}

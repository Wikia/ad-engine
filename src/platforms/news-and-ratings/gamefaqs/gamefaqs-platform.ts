import { Injectable } from '@wikia/dependency-injection';
import { bidders, communicationService, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsDynamicSlotsSetup } from './setup/dynamic-slots/gamefaqs-dynamic-slots.setup';
import { NewsAndRatingsTargetingSetup } from '../shared';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';
import { NewsAndRatingsBaseContextSetup } from '../shared';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			NewsAndRatingsBaseContextSetup,
			() => bootstrapAndGetConsent(),
			NewsAndRatingsTargetingSetup,
			GamefaqsSlotsContextSetup,
			GamefaqsDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			GamefaqsPrebidConfigSetup,
			() =>
				bidders
					.call()
					.then(() => communicationService.emit(eventsRepository.AD_ENGINE_PARTNERS_READY)),
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}

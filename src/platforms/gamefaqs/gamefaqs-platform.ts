import { Injectable } from '@wikia/dependency-injection';
import {
	bidders,
	communicationService,
	context,
	eventsRepository,
	utils,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamefaqsSlotsContextSetup } from './setup/context/slots/gamefaqs-slots-context.setup';
import { GamefaqsDynamicSlotsSetup } from './setup/dynamic-slots/gamefaqs-dynamic-slots.setup';
import { GamefaqsPrebidConfigSetup } from './setup/context/prebid/gamefaqs-prebid-config.setup';

@Injectable()
export class GamefaqsPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			// TODO: to decide if we want to call instant-config service for the first releases?
			() => bootstrapAndGetConsent(),
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

	private shouldSwitchGamToRV() {
		return utils.queryString.get('switch_to_rv_gam') === '1';
	}

	private shouldSwitchSrcToTest() {
		return utils.queryString.get('switch_src_to_test') === '1';
	}
}

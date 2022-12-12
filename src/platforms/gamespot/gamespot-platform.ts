import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	eventsRepository,
	ProcessPipeline,
	utils,
} from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup } from '@platforms/shared';

import { basicContext } from './ad-context';
import { GamespotSlotsContextSetup } from './setup/context/slots/gamespot-slots-context.setup';
import { GamespotDynamicSlotsSetup } from './setup/dynamic-slots/gamespot-dynamic-slots.setup';

@Injectable()
export class GameSpotPlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			() => bootstrapAndGetConsent(),
			// TODO: to decide if we want to call instant-config service for the first releases?
			GamespotSlotsContextSetup,
			GamespotDynamicSlotsSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
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

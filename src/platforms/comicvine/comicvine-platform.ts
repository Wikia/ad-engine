import { Injectable } from '@wikia/dependency-injection';

import { communicationService, context, eventsRepository, utils, ProcessPipeline } from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup, InstantConfigSetup } from '@platforms/shared';

import { basicContext } from './ad-context';

import { ComicvineSlotsContextSetup } from './setup/context/slots/comicvine-slots-context.setup';
import { ComicvineDynamicSlotsSetup } from './setup/dynamic-slots/comicvine-dynamic-slots.setup';

@Injectable()
export class ComicvinePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			ComicvineDynamicSlotsSetup,
			ComicvineSlotsContextSetup,
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

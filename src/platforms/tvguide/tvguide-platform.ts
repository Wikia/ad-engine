import { Injectable } from '@wikia/dependency-injection';
import {
	communicationService,
	context,
	eventsRepository,
	ProcessPipeline,
	utils,
} from '@wikia/ad-engine';
import { bootstrapAndGetConsent, gptSetup, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';

import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';

@Injectable()
export class TvGuidePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			() => context.set('custom.dfpId', this.shouldSwitchGamToRV() ? 22309610186 : 5441),
			() => context.set('src', this.shouldSwitchSrcToTest() ? ['test'] : context.get('src')),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TvGuideDynamicSlotsSetup,
			TvGuideSlotsContextSetup,
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

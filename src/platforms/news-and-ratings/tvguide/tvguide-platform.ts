import { bootstrapAndGetConsent, GptSetup, InstantConfigSetup } from '@platforms/shared';
import { communicationService, context, eventsRepository, ProcessPipeline } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { NewsAndRatingsBaseContextSetup } from '../shared';
import { basicContext } from './ad-context';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';

@Injectable()
export class TvGuidePlatform {
	constructor(private pipeline: ProcessPipeline, private gptSetup: GptSetup) {}

	execute(): void {
		this.pipeline.add(
			() => context.extend(basicContext),
			NewsAndRatingsBaseContextSetup,
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			() => bootstrapAndGetConsent(),
			InstantConfigSetup,
			TvGuideDynamicSlotsSetup,
			TvGuideSlotsContextSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			this.gptSetup.call,
		);

		this.pipeline.execute();
	}
}

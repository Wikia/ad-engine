import { Injectable } from '@wikia/dependency-injection';
import {
	Bootstrap,
	communicationService,
	eventsRepository,
	ProcessPipeline,
} from '@wikia/ad-engine';
import { gptSetup, InstantConfigSetup } from '@platforms/shared';
import { basicContext } from './ad-context';
import { TvGuideSlotsContextSetup } from './setup/context/slots/tvguide-slots-context.setup';
import { TvGuideDynamicSlotsSetup } from './setup/dynamic-slots/tvguide-dynamic-slots.setup';
import { NewsAndRatingsBaseContextSetup } from '../shared';

@Injectable()
export class TvGuidePlatform {
	constructor(private pipeline: ProcessPipeline) {}

	execute(): void {
		this.pipeline.add(
			() => Bootstrap.setupContextAndGeo(basicContext),
			// once we have Geo cookie set on varnishes we can parallel bootstrapAndGetConsent and InstantConfigSetup
			InstantConfigSetup,
			Bootstrap.setupConsent,
			NewsAndRatingsBaseContextSetup,
			TvGuideDynamicSlotsSetup,
			TvGuideSlotsContextSetup,
			// TODO: add targeting setup once we have idea of page-level and slot-level targeting
			() => communicationService.emit(eventsRepository.AD_ENGINE_CONFIGURED),
			gptSetup.call,
		);

		this.pipeline.execute();
	}
}

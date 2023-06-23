import { insertSlots } from '@platforms/shared';
import { communicationService, context, DiProcess, eventsRepository } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import {
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsSlotsDefinitionRepository,
} from '../../../shared';

@Injectable()
export class MetacriticDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository,
		private dynamicSlotsSetup: NewsAndRatingsDynamicSlotsSetup,
	) {}

	execute(): void {
		this.dynamicSlotsSetup.injectSlots('.ad_unit', ['nav_ad', 'nav-ad']);

		insertSlots([this.slotsDefinitionRepository.getInterstitialConfig()]);

		communicationService.on(eventsRepository.AD_ENGINE_UAP_NTC_LOADED, () =>
			insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]),
		);

		// ToDo: any conditions?
		context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
	}
}

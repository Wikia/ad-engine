import { insertSlots } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
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

		insertSlots([this.slotsDefinitionRepository.getFloorAdhesionConfig()]);
	}
}

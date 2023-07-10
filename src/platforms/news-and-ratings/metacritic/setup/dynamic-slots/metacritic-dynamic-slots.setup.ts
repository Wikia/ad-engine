import { insertSlots } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import {
	NewsAndRatingsDynamicSlotsSetup,
	NewsAndRatingsSlotsDefinitionRepository,
} from '../../../shared';

@injectable()
export class MetacriticDynamicSlotsSetup implements DiProcess {
	constructor(
		private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository,
		private dynamicSlotsSetup: NewsAndRatingsDynamicSlotsSetup,
	) {}

	execute(): void {
		this.dynamicSlotsSetup.injectSlots('.ad_unit', ['nav_ad', 'nav-ad']);

		insertSlots([
			this.slotsDefinitionRepository.getInterstitialConfig(),
			this.slotsDefinitionRepository.getFloorAdhesionConfig(),
		]);
	}
}

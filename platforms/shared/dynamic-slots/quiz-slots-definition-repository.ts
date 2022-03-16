import { context, handleUpdateCorrelator, slotService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { SlotSetupDefinition } from '../utils/insert-slots';

@Injectable()
export class QuizSlotsDefinitionRepository {
	getQuizAdConfig(slotName: string): SlotSetupDefinition {
		return {
			activator: () => {
				const slot = slotService.get(slotName);
				if (slot) {
					slotService.remove(slot);
					handleUpdateCorrelator();
				}
				context.push('state.adStack', { id: slotName });
			},
		};
	}
}

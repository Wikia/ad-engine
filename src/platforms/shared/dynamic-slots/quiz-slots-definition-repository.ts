import { context, slotService } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

import { SlotSetupDefinition } from '../utils/insert-slots';

@injectable()
export class QuizSlotsDefinitionRepository {
	getQuizAdConfig(slotName: string): SlotSetupDefinition {
		return {
			activator: () => {
				const slot = slotService.get(slotName);
				if (slot) {
					slotService.remove(slot);
				}
				context.push('state.adStack', { id: slotName });
			},
		};
	}
}

import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { SlotSetupDefinition } from '../utils/insert-slots';

@Injectable()
export class QuizSlotsDefinitionRepository {
	getQuizAdConfig(slotName: string): SlotSetupDefinition {
		return {
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}
}

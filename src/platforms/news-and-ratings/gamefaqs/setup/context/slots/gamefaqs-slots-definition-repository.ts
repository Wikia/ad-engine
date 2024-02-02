import { context } from '@ad-engine/core';
import { SlotSetupDefinition } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GameFAQsSlotsDefinitionRepository {
	getIncontentPlayerConfig(): SlotSetupDefinition {
		const slotName = 'incontent_player';

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: '.msg_list .msg_body',
				insertMethod: 'prepend',
			},
			activator: () => {
				context.push('state.adStack', { id: slotName });
			},
		};
	}
}

import { SlotSetupDefinition } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsSlotsDefinitionRepository {
	getCdmZoneConfig(counter: number, lazyLoaded = false): SlotSetupDefinition {
		const slotName = `cdm-zone-0${counter}`;

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: `#${slotName}`,
				insertMethod: 'prepend',
				classList: ['hidden-ad', 'ad-slot'],
			},
			activator: () => {
				if (lazyLoaded) {
					context.push('events.pushOnScroll.ids', slotName);
				} else {
					context.push('state.adStack', { id: slotName });
				}
			},
		};
	}
}

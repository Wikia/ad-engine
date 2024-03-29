import { SlotSetupDefinition } from '@platforms/shared';
import { AdSlot, context } from '@wikia/ad-engine';
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
				classList: [AdSlot.HIDDEN_AD_CLASS, 'ad-slot'],
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

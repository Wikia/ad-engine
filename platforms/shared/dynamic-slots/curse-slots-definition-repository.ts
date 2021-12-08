import { context, SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

export interface SlotSetupDefinition {
	slotCreatorConfig: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

@Injectable()
export class CurseSlotsDefinitionRepository {
	constructor() {}

	getCdmZoneConfig(counter: number, lazyLoaded: boolean = false): SlotSetupDefinition {
		if (counter === 4 && context.get('state.isMobile')) {
			return;
		}

		const slotName = `cdm-zone-0${counter}`;

		return {
			slotCreatorConfig: {
				slotName,
				anchorSelector: `#${slotName}`,
				insertMethod: 'prepend',
				classList: ['hide', 'ad-slot'],
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

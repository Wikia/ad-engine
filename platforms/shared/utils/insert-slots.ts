import { SlotCreator, SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { slotsContext } from '../slots/slots-context';

export interface SlotSetupDefinition {
	slotCreatorConfig?: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

const slotCreator = new SlotCreator();

export function insertSlots(slotsToInsert: SlotSetupDefinition[]): void {
	slotsToInsert
		.filter((config) => !!config)
		.forEach(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
			try {
				slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
				if (activator) {
					activator();
				}
			} catch (e) {
				slotsContext.setState(slotCreatorConfig.slotName, false);
			}
		});
}

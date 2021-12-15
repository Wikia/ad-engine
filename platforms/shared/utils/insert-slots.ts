import { SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { slotsContext } from '../slots/slots-context';

export interface SlotSetupDefinition {
	slotCreatorConfig?: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

export function insertSlots(slotsToInsert: SlotSetupDefinition[]): void {
	slotsToInsert
		.filter((config) => !!config)
		.forEach(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
			try {
				this.slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
				if (activator) {
					activator();
				}
			} catch (e) {
				slotsContext.setState(slotCreatorConfig.slotName, false);
			}
		});
}

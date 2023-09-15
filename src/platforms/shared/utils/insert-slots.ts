import { SlotCreator, SlotCreatorConfig, SlotCreatorWrapperConfig, utils } from '@wikia/ad-engine';
import { slotsContext } from '../slots/slots-context';

export interface SlotSetupDefinition {
	slotCreatorConfig?: SlotCreatorConfig;
	slotCreatorWrapperConfig?: SlotCreatorWrapperConfig;
	activator?: () => void;
}

export interface SlotsDefinitionRepository {
	getGalleryLeaderboardConfig(): SlotSetupDefinition;
}

const logGroup = 'insert-slot';
const slotCreator = new SlotCreator();

export function insertSlots(slotsToInsert: SlotSetupDefinition[]): HTMLElement[] {
	return slotsToInsert
		.filter((config) => !!config)
		.map(({ slotCreatorConfig, slotCreatorWrapperConfig, activator }) => {
			try {
				const slot = slotCreator.createSlot(slotCreatorConfig, slotCreatorWrapperConfig);
				if (activator) {
					activator();
				}
				return slot;
			} catch (e) {
				utils.logger(logGroup, e.message);

				if (slotCreatorConfig?.slotName) {
					slotsContext.setState(slotCreatorConfig.slotName, false);
				}
			}
		});
}

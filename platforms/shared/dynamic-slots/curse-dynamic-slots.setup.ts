import { context, DiProcess, SlotCreator } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../slots/slots-context';
import {
	CurseSlotsDefinitionRepository,
	SlotSetupDefinition,
} from './curse-slots-definition-repository';

@Injectable()
export class CurseDynamicSlotsSetup implements DiProcess {
	private uapFirstCallSlotName = 'cdm-zone-01';

	constructor(
		private slotCreator: SlotCreator,
		private slotsDefinitionRepository: CurseSlotsDefinitionRepository,
	) {}

	execute(): void {
		this.configureUap();
		this.insertSlots([
			this.slotsDefinitionRepository.getCdmZoneConfig(1),
			this.slotsDefinitionRepository.getCdmZoneConfig(2),
			this.slotsDefinitionRepository.getCdmZoneConfig(3),
			this.slotsDefinitionRepository.getCdmZoneConfig(4, true),
			this.slotsDefinitionRepository.getCdmZoneConfig(6),
		]);
	}

	private insertSlots(slotsToInsert: SlotSetupDefinition[]): void {
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

	configureUap(): void {
		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];

		slotsContext.addSlotSize(this.uapFirstCallSlotName, uapSize);
	}
}

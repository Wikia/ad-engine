import { insertSlots, slotsContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SportsSlotsDefinitionRepository } from './sports-slots-definition-repository.service';

@Injectable()
export class SportsDynamicSlotsSetup implements DiProcess {
	private uapFirstCallSlotName = 'cdm-zone-01';

	constructor(private slotsDefinitionRepository: SportsSlotsDefinitionRepository) {}

	execute(): void {
		this.configureUap();

		const slotsIdsToInsert = context.get('state.isMobile') ? [1, 2, 3, 6] : [1, 2, 3, 4, 6];
		const slotsToInsert = slotsIdsToInsert.map((id) =>
			this.slotsDefinitionRepository.getCdmZoneConfig(id, id === 4),
		);

		insertSlots(slotsToInsert);
	}

	configureUap(): void {
		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];

		slotsContext.addSlotSize(this.uapFirstCallSlotName, uapSize);
	}
}

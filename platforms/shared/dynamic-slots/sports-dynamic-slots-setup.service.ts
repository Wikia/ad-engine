import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../slots/slots-context';
import { insertSlots } from '../utils/insert-slots';
import { SportsSlotsDefinitionRepository } from './sports-slots-definition-repository.service';

@Injectable()
export class SportsDynamicSlotsSetup implements DiProcess {
	private uapFirstCallSlotName = 'cdm-zone-01';

	constructor(private slotsDefinitionRepository: SportsSlotsDefinitionRepository) {}

	execute(): void {
		this.configureUap();
		insertSlots([
			this.slotsDefinitionRepository.getCdmZoneConfig(1),
			this.slotsDefinitionRepository.getCdmZoneConfig(2),
			this.slotsDefinitionRepository.getCdmZoneConfig(3),
			this.slotsDefinitionRepository.getCdmZoneConfig(4, true),
			this.slotsDefinitionRepository.getCdmZoneConfig(6),
		]);
	}

	configureUap(): void {
		const uapSize: [number, number] = context.get('state.isMobile') ? [2, 2] : [3, 3];

		slotsContext.addSlotSize(this.uapFirstCallSlotName, uapSize);
	}
}

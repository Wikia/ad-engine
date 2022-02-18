import { insertSlots, slotsContext } from '@platforms/shared';
import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { SportsSlotsDefinitionRepository } from './sports-slots-definition-repository';

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
		slotsContext.addSlotSize(
			'cdm-zone-03',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);
		slotsContext.addSlotSize(
			'cdm-zone-06',
			universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
		);

		if (context.get('state.isMobile')) {
			slotsContext.addSlotSize(
				this.uapFirstCallSlotName,
				universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
			);
			slotsContext.addSlotSize(
				'cdm-zone-02',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['4x4'].size,
			);
		} else {
			slotsContext.addSlotSize(
				this.uapFirstCallSlotName,
				universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
			);
			slotsContext.addSlotSize(
				'cdm-zone-02',
				universalAdPackage.UAP_ADDITIONAL_SIZES.companionSizes['5x5'].size,
			);
		}
	}
}

import { RoadblockTemplateConfig } from '@wikia/ad-engine';

export function getRoadblockConfig(): RoadblockTemplateConfig {
	return {
		slotsToEnable: ['cdm-zone-01', 'cdm-zone-02'],
		slotsToDisable: ['cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06', 'incontent_player'],
		onInit: () => {},
	};
}

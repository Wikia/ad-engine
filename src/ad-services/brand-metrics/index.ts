import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, utils } from '@ad-engine/core';

const logGroup = 'brand-metrics';

export class BrandMetrics extends BaseServiceSetup {
	call(): void {
		if (!this.instantConfig.get('icBrandMetrics')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		communicationService.on(eventsRepository.AD_ENGINE_SLOT_LOADED, this.loadScript, true);
	}

	private loadScript(): void {
		const libraryUrl = `//cdn.brandmetrics.com/tag/9097a5369e204e6eac53b45c7dde13c5/fandom.com_au.js`;
		utils.logger(logGroup, 'loading', libraryUrl);

		utils.timedPartnerScriptLoader.loadScriptWithStatus(libraryUrl, logGroup).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

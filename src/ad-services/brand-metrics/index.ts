import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, timedPartnerScriptLoader } from '@ad-engine/utils';

const logGroup = 'brand-metrics';

export class BrandMetrics extends BaseServiceSetup {
	call(): void {
		if (!this.instantConfig.get('icBrandMetrics')) {
			logger(logGroup, 'disabled');
			return;
		}

		communicationService.on(eventsRepository.AD_ENGINE_SLOT_LOADED, this.loadScript, true);
	}

	private loadScript(): void {
		const libraryUrl = `//cdn.brandmetrics.com/tag/9097a5369e204e6eac53b45c7dde13c5/fandom.com_au.js`;
		logger(logGroup, 'loading', libraryUrl);

		timedPartnerScriptLoader.loadScriptWithStatus(libraryUrl, logGroup).then(() => {
			logger(logGroup, 'ready');
		});
	}
}

import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { context } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader } from '@ad-engine/utils';

const logGroup = 'wunderkind';

export class Wunderkind extends BaseServiceSetup {
	call(): void {
		if (context.get('state.isLogged')) {
			logger(logGroup, 'disabled - user is logged');
			return;
		}

		if (!this.instantConfig.get('icWunderkind')) {
			logger(logGroup, 'disabled');
			return;
		}

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				logger(logGroup, 'disabled - UAP is loaded');
				return;
			}
			this.loadScript();
		});
	}

	private loadScript(): void {
		const libraryUrl = `//tag.wknd.ai/5047/i.js`;
		logger(logGroup, 'loading', libraryUrl);

		scriptLoader.loadScript(libraryUrl).then(() => {
			logger(logGroup, 'ready');
		});
	}
}

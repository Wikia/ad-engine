import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';

const logGroup = 'wunderkind';

export class Wunderkind extends BaseServiceSetup {
	call(): void {
		if (!this.instantConfig.get('icWunderkind')) {
			utils.logger(logGroup, 'Disabled');
			return;
		} else if (context.get('state.isLogged')) {
			utils.logger(logGroup, 'User is logged');
			return;
		}

		communicationService.on(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (!action.isLoaded) {
				this.loadScript();
			} else {
				utils.logger(logGroup, 'Disabled - UAP');
			}
		});
	}

	private loadScript(): void {
		const libraryUrl = `//tag.wknd.ai/5047/i.js`;
		utils.logger(logGroup, 'loading', libraryUrl);

		utils.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

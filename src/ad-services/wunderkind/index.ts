import { communicationService, UapLoadStatus } from '@ad-engine/communication';
import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { AD_ENGINE_UAP_LOAD_STATUS } from "../../communication/events/events-ad-engine-uap";

const logGroup = 'wunderkind';

export class Wunderkind extends BaseServiceSetup {
	call(): void {
		if (context.get('state.isLogged')) {
			utils.logger(logGroup, 'disabled - user is logged');
			return;
		}

		if (!this.instantConfig.get('icWunderkind')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		communicationService.on(AD_ENGINE_UAP_LOAD_STATUS, (action: UapLoadStatus) => {
			if (action.isLoaded) {
				utils.logger(logGroup, 'disabled - UAP is loaded');
				return;
			}
			this.loadScript();
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

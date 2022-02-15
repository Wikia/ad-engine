import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';

const profileId = '2721';
const pubId = '156260';

const logGroup = 'IdentityHub';

class IdentityHub {
	private isLoaded = false;
	private identityHubScriptSrc = `https://ads.pubmatic.com/AdServer/js/pwt/${pubId}/${profileId}/pwt.js`;

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			return utils.scriptLoader.loadScript(this.identityHubScriptSrc).then(() => {
				communicationService.emit(eventsRepository.IdentityHub_JS_LOADED);
				this.isLoaded = true;
			});
		}
	}

	private isEnabled(): boolean {
		return (
			context.get('pubmatic.identityHub.enabled') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}
}

export const identityHub = new IdentityHub();

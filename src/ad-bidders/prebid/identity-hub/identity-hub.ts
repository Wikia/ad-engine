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
			return;
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			// PWT.jsLoaded() is part of Pubmatic script, it's called when IdentityHub is ready
			// it needs to be defined before loading the script
			window.PWT = {
				jsLoaded: () => {
					utils.logger(logGroup, 'scriptLoader.loadScript loaded');
					return Promise.resolve();
				},
			};
			return utils.scriptLoader.loadScript(this.identityHubScriptSrc).then(() => {
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

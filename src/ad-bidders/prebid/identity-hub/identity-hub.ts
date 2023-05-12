import { BaseServiceSetup, utils } from '@ad-engine/core';

const profileId = '2721';
const pubId = '156260';

const logGroup = 'IdentityHub';

export class IdentityHub extends BaseServiceSetup {
	private isLoaded = false;
	private identityHubScriptSrc = `https://ads.pubmatic.com/AdServer/js/pwt/${pubId}/${profileId}/pwt.js`;

	call(): Promise<void> {
		if (
			!this.isEnabled('bidders.identityHub.enabled') ||
			this.isEnabled('bidders.prebid.intentIQ')
		) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		utils.logger(logGroup, 'enabled');

		if (!this.isLoaded) {
			// PWT.jsLoaded() is part of Pubmatic script, it's called when IdentityHub is ready
			// it needs to be defined before loading the script
			window.PWT = {
				jsLoaded: () => {
					utils.logger(logGroup, 'jsLoaded done');
					return Promise.resolve();
				},
			};
			return utils.scriptLoader.loadScript(this.identityHubScriptSrc).then(() => {
				utils.logger(logGroup, 'script loaded');
				this.isLoaded = true;
			});
		}
	}
}

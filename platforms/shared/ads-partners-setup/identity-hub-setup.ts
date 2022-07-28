import { BaseServiceSetup, context, utils } from '@wikia/ad-engine';

const profileId = '2721';
const pubId = '156260';

const logGroup = 'IdentityHub';
class IdentityHubSetup extends BaseServiceSetup {
	private identityHubScriptSrc = `https://ads.pubmatic.com/AdServer/js/pwt/${pubId}/${profileId}/pwt.js`;

	private isEnabled(): boolean {
		return (
			context.get('pubmatic.identityHub.enabled') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}
	initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			utils.logger(logGroup, 'enabled');

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
				this.res();
			});
		}
	}
}

export const identityHubSetup = new IdentityHubSetup();

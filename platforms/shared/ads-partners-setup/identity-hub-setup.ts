import { BaseServiceSetup, identityHub } from '@wikia/ad-engine';

class IdentityHubSetup extends BaseServiceSetup {
	async initialize() {
		await identityHub.call();
		this.setInitialized();
	}
}

export const identityHubSetup = new IdentityHubSetup();

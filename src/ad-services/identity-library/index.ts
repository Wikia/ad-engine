import { context, utils } from '@ad-engine/core';

const logGroup = 'identity-library';
const scriptUrl = '//js-sec.indexww.com/ht/p/183085-19173550049191.js';

class IdentityLibrary {
	private isLoaded = false;

	private isEnabled(): boolean {
		return context.get('services.ixIdentityLibrary.enabled');
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			utils.scriptLoader.loadScript(scriptUrl, 'text/javascript', true, 'first');
			this.isLoaded = true;
		}
	}
}

export const identityLibrary = new IdentityLibrary();

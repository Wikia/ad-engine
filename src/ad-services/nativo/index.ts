import { context, utils } from '@ad-engine/core';

const logGroup = 'nativo';
const libraryUrl = 'https://s.ntv.io/serve/load.js';

class Nativo {
	call(): Promise<void> {
		if (!this.isEnabled()) {
			return;
		}

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, 'data-ntv-set-no-auto-start')
			.then(() => {
				utils.logger(logGroup, 'ready');
			});
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled');
	}
}
export const nativo = new Nativo();

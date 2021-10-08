import { context, utils } from '@ad-engine/core';

const logGroup = 'nativo';
const libraryUrl = 'https://s.ntv.io/serve/load.js';

class Nativo {
	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		return (
			utils.scriptLoader
				// @ts-ignore
				.loadScript(libraryUrl, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
				.then(() => {
					utils.logger(logGroup, 'ready');
				})
		);
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled');
	}
}
export const nativo = new Nativo();

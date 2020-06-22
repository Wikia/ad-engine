import { context, utils } from '@ad-engine/core';

const logGroup = 'distroScale';

class DistroScale {
	call(): Promise<void> {
		const id: string = context.get('services.distroScale.id');

		if (!context.get('services.distroScale.enabled') || !id) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//c.jsrdn.com/s/cs.js?p=${id}`;

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const distroScale = new DistroScale();

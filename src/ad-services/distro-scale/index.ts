import { context, utils } from '@ad-engine/core';

const logGroup = 'distroScale';

class DistroScale {
	isEnabled(): boolean {
		return context.get('services.distroScale.enabled') && context.get('services.distroScale.id');
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//c.jsrdn.com/s/cs.js?p=${context.get('services.distroScale.id')}`;

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const distroScale = new DistroScale();

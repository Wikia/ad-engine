import { context, utils } from '@ad-engine/core';

const logGroup = 'RealVu';

class RealVu {
	call(): Promise<void> {
		const id: string = context.get('services.realVu.id');

		if (!context.get('services.realVu.enabled') || !id) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		const libraryUrl = `//ac.realvu.net/flip/2/${id}`;

		utils.logger(logGroup, 'loading', libraryUrl);

		return utils.scriptLoader.loadScript(libraryUrl, 'text/javascript', true).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const realVu = new RealVu();

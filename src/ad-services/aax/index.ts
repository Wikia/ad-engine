import { context, utils } from '@ad-engine/core';

const logGroup = 'aax';
const scriptDomain = 'https://c.aaxads.com/aax.js';

function loadScript(pubId: string, hostname: string): Promise<Event> {
	const version = '1.2';
	const aaxLibraryUrl = `${scriptDomain}?pub=${pubId}&hst=${hostname}&ver=${version}`;

	return utils.scriptLoader.loadScript(aaxLibraryUrl);
}

class Aax {
	call(): Promise<void> {
		const pubId = context.get('services.aax.pubId');

		if (!context.get('services.aax.enabled') || !pubId) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading', scriptDomain);

		window.aax = window.aax || {};
		const hostname = window.location.hostname;

		return loadScript(pubId, hostname).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const aax = new Aax();

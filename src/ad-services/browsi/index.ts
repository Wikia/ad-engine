import { context, utils } from '@wikia/ad-engine';

const logGroup = 'browsi';

/**
 * Injects browsi script
 */
function loadScript(): Promise<Event> {
	const browsiLibraryUrl = `https://middycdn-a.akamaihd.net/bootstrap/bootstrap.js`;

	return utils.scriptLoader.loadScript(browsiLibraryUrl, 'text/javascript', true, 'first', {
		id: 'browsi-tag',
		dataset: {
			pubKey: 'fandom',
			siteKey: 'fandom',
		},
	});
}

class Browsi {
	/**
	 * Inserts browsi tag
	 */
	call(): Promise<void> {
		if (!context.get('services.browsi.enabled') || !context.get('options.trackingOptIn')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		return loadScript().then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const browsi = new Browsi();

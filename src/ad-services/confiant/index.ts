import { context, utils } from '@wikia/ad-engine';

const logGroup = 'confiant';
const scriptDomain = 'confiant-integrations.global.ssl.fastly.net';

/**
 * Injects Confiant script
 * @returns {Promise}
 */
function loadScript(propertyId: string): Promise<Event> {
	const confiantLibraryUrl = `//${scriptDomain}/${propertyId}/gpt_and_prebid/config.js`;

	return utils.scriptLoader.loadScript(confiantLibraryUrl, 'text/javascript', true, 'first');
}

/**
 * Confiant service handler
 */
class Confiant {
	/**
	 * Requests service and injects script tag
	 * @returns {Promise}
	 */
	call(): Promise<void> {
		const propertyId: string = context.get('services.confiant.propertyId');

		if (!context.get('services.confiant.enabled') || !propertyId) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		window.confiant = window.confiant || {};

		return loadScript(propertyId).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const confiant = new Confiant();

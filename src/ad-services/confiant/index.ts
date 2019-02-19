import { context, utils } from '@wikia/ad-engine';

const logGroup = 'confiant';
const scriptDomain = 'clarium.global.ssl.fastly.net';

/**
 * Injects Confiant script
 * @returns {Promise}
 */
function loadScript() {
	const confiantLibraryUrl = `//${scriptDomain}/gpt/a/wrap.js`;

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
	call() {
		const propertyId = context.get('services.confiant.propertyId');
		const mapping = context.get('services.confiant.mapping');
		const activation = context.get('services.confiant.activation');

		if (!context.get('services.confiant.enabled') || !propertyId || !mapping || !activation) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		// eslint-disable-next-line  no-underscore-dangle
		window._clrm = window._clrm || {};
		// eslint-disable-next-line  no-underscore-dangle
		window._clrm.gpt = {
			propertyId,
			confiantCdn: scriptDomain,
			sandbox: 0,
			mapping,
			activation,
			callback: (...args) => {
				utils.logger(logGroup, args);
			},
		};

		return loadScript().then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const confiant = new Confiant();

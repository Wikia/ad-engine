import { context, localCache, utils } from '@wikia/ad-engine';

const logGroup = 'krux';

/**
 * Injects Krux script
 * @returns {Promise}
 */
function loadScript() {
	const kruxId = context.get('services.krux.id');
	const kruxLibraryUrl = `//cdn.krxd.net/controltag?confid=${kruxId}`;

	return utils.scriptLoader.loadScript(kruxLibraryUrl, 'text/javascript', true, 'first', {
		id: 'krux-control-tag',
	});
}

/**
 * Gets Krux data from localStorage
 * @param {string} key
 * @returns {string}
 */
function getKruxData(key) {
	if (localCache.canUseStorage()) {
		return window.localStorage[key];
	}
	if (window.navigator.cookieEnabled) {
		const match = document.cookie.match(`${key}=([^;]*)`);

		return (match && decodeURI(match[1])) || '';
	}

	return '';
}

window.Krux =
	window.Krux ||
	function (...args) {
		window.Krux.q.push(args);
	};
window.Krux.q = window.Krux.q || [];

/**
 * Krux service handler
 */
class Krux {
	/**
	 * Requests service, saves user id and segments in context and exports page level params
	 * @returns {Promise}
	 */
	call() {
		if (!context.get('services.krux.enabled') || !context.get('options.trackingOptIn')) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		return loadScript().then(() => {
			this.exportPageParams();
			this.importUserData();
		});
	}

	/**
	 * Export page level params to Krux
	 * @returns {void}
	 */
	exportPageParams() {
		Object.keys(context.get('targeting') || {}).forEach((key) => {
			const value = context.get(`targeting.${key}`);

			if (value) {
				window[`kruxDartParam_${key}`] = value;
			}
		});
	}

	/**
	 * Imports Krux data from localStorage
	 * @returns {void}
	 */
	importUserData() {
		const user = getKruxData('kxuser') || getKruxData('kxwikia_user');
		const segments = getKruxData('kxsegs') || getKruxData('kxwikia_segs');

		context.set('targeting.kuid', user || null);
		context.set('targeting.ksg', segments ? segments.split(',') : []);
		utils.logger(logGroup, 'data set', user, segments);
	}

	/**
	 * Returns Krux user ID
	 * @returns {string}
	 */
	getUserId() {
		return context.get('targeting.kuid') || null;
	}

	/**
	 * Returns Krux segments
	 * @returns {string[]}
	 */
	getSegments() {
		return context.get('targeting.ksg') || [];
	}
}

export const krux = new Krux();

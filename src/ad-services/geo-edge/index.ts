import { context, utils } from '@wikia/ad-engine';

const logGroup = 'geo-edge';
const scriptDomainId = 'd3b02estmut877';

/**
 * Injects Geo Edge Site Side Protection script
 * @returns {Promise}
 */
function loadScript() {
	const geoEdgeLibraryUrl = `//${scriptDomainId}.cloudfront.net/grumi-ip.js`;

	return utils.scriptLoader.loadScript(geoEdgeLibraryUrl, 'text/javascript', true, 'first');
}

/**
 * GeoEdge service handler
 */
class GeoEdge {
	/**
	 * Requests service and injects script tag
	 * @returns {Promise}
	 */
	call() {
		const geoEdgeKey = context.get('services.geoEdge.id');
		const geoEdgeConfig = context.get('services.geoEdge.config');

		if (!context.get('services.geoEdge.enabled') || !geoEdgeKey) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');
		window.grumi = {
			cfg: geoEdgeConfig,
			key: geoEdgeKey,
		};

		return loadScript().then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

export const geoEdge = new GeoEdge();

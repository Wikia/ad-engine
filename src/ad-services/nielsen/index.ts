/* global NOLBUNDLE */
import { context, utils } from '@wikia/ad-engine';
import { initNielsenStaticQueue } from './static-queue-script';

const logGroup = 'nielsen-dcr';
const nlsnConfig: {[key: string]: any} = {};

/**
 * Creates Nielsen Static Queue Snippet
 */
function createInstance(nielsenKey) {
	utils.logger(logGroup, 'loading');

	initNielsenStaticQueue();

	return NOLBUNDLE.nlsQ(nielsenKey, 'nlsnInstance', nlsnConfig);
}

/**
 * Nielsen service handler
 */
class Nielsen {

	nlsnInstance: any = null;
	/**
	 * Class constructor
	 */

	constructor() {

		if (utils.queryString.get('nielsen-dcr-debug') === '1') {
			nlsnConfig.nol_sdkDebug = 'debug';
		}
	}

	/**
	 * Create Nielsen Static Queue and make a call
	 * @param {Object} nielsenMetadata
	 * @returns {Object}
	 */
	call(nielsenMetadata) {
		const nielsenKey = context.get('services.nielsen.appId');

		if (!context.get('services.nielsen.enabled') || !nielsenKey) {
			utils.logger(logGroup, 'disabled');

			return null;
		}

		if (!this.nlsnInstance) {
			this.nlsnInstance = createInstance(nielsenKey);
		}

		utils.logger(logGroup, 'ready');

		this.nlsnInstance.ggPM('staticstart', nielsenMetadata);

		utils.logger(logGroup, 'called', nielsenMetadata);

		return this.nlsnInstance;
	}
}

export const nielsen = new Nielsen();

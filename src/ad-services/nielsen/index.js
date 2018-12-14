/* global NOLBUNDLE */
import { context, utils } from '@wikia/ad-engine';
import { initNielsenStaticQueue } from './static-queue-script';

const logGroup = 'nielsen-dcr';
const nlsnConfig = {};

/**
 * Creates Nielsen Static Queue Snippet
 */
function createInstance(nielsenKey) {
	utils.logger(logGroup, 'loading');

	initNielsenStaticQueue();

	NOLBUNDLE.nlsQ(nielsenKey, 'nlsnInstance', nlsnConfig);
}

/**
 * Nielsen service handler
 */
class Nielsen {
	/**
	 * Class constructor
	 */
	constructor() {
		this.nlsnInstance = null;

		if (utils.queryString.get('nielsen-dcr-debug') === '1') {
			nlsnConfig.nol_sdkDebug = 'debug';
		}
	}

	/**
	 * Create Nielsen Static Queue and make a call
	 * @param {Object} nielsenMetadata
	 */
	call(nielsenMetadata) {
		const nielsenKey = context.get('services.nielsen.appId');

		if (!context.get('services.nielsen.enabled') || !nielsenKey) {
			utils.logger(logGroup, 'disabled');
		}

		if (!this.nlsnInstance) {
			this.nlsnInstance = createInstance(nielsenKey);
		}

		utils.logger(logGroup, 'ready');

		this.nlsnInstance.ggPM('staticstart', nielsenMetadata);

		utils.logger(logGroup, 'called', nielsenMetadata);
	}
}

export const nielsen = new Nielsen();

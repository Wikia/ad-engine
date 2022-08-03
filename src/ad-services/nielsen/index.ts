import { BaseServiceSetup, context, Dictionary, utils } from '@ad-engine/core';
import { initNielsenStaticQueue } from './static-queue-script';

const logGroup = 'nielsen-dcr';
const nlsnConfig: Dictionary = {};

/**
 * Creates Nielsen Static Queue Snippet
 */
function createInstance(nielsenKey): any {
	utils.logger(logGroup, 'loading');

	initNielsenStaticQueue();

	return window.NOLBUNDLE.nlsQ(nielsenKey, 'nlsnInstance', nlsnConfig);
}

/**
 * Nielsen service handler
 */
class Nielsen extends BaseServiceSetup {
	nlsnInstance: any = null;
	/**
	 * Class constructor
	 */

	constructor() {
		super();
		if (utils.queryString.get('nielsen-dcr-debug') === '1') {
			nlsnConfig.nol_sdkDebug = 'debug';
		}
	}

	/**
	 * Create Nielsen Static Queue and make a call
	 * @param {Object} nielsenMetadata
	 * @returns {Object}
	 */
	call(): void {
		const nielsenKey = context.get('services.nielsen.appId');

		if (!context.get('services.nielsen.enabled') || !nielsenKey) {
			utils.logger(logGroup, 'disabled');

			return null;
		}

		if (!this.nlsnInstance) {
			this.nlsnInstance = createInstance(nielsenKey);
		}

		utils.logger(logGroup, 'ready');

		this.nlsnInstance.ggPM('staticstart', this.metadata);

		utils.logger(logGroup, 'called', this.metadata);

		return this.nlsnInstance;
	}
}

export const nielsen = new Nielsen();

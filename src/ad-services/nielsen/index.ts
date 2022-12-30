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
export class Nielsen extends BaseServiceSetup {
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
	 * @returns {Object}
	 */
	call(): void {
		const nielsenKey = context.get('services.nielsen.appId');
		const targeting = context.get('targeting');
		const section = context.get('services.nielsen.customSection') || targeting.s0v;
		const articleId = targeting.post_id || targeting.artid;

		if (!context.get('services.nielsen.enabled') || !nielsenKey) {
			utils.logger(logGroup, 'disabled');

			return null;
		}

		if (!this.nlsnInstance) {
			this.nlsnInstance = createInstance(nielsenKey);
		}

		utils.logger(logGroup, 'ready');

		const metadata = {
			type: 'static',
			assetid: `fandom.com/${section}/${targeting.s1}/${articleId}`,
			section: `FANDOM ${section.replaceAll('_', ' ').toUpperCase()} NETWORK`,
		};

		this.nlsnInstance.ggPM('static', metadata);
		utils.logger(logGroup, 'called', metadata);

		return this.nlsnInstance;
	}
}

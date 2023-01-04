import { BaseServiceSetup, context, Dictionary, utils } from '@ad-engine/core';
import { initNielsenStaticQueue } from './static-queue-script';

const logGroup = 'nielsen-dcr';
const nlsnConfig: Dictionary = {};
const nielsenKey = 'P26086A07-C7FB-4124-A679-8AC404198BA7';

/**
 * Creates Nielsen Static Queue Snippet
 */
function createInstance(nielsenKey): any {
	utils.logger(logGroup, 'loading');

	initNielsenStaticQueue();

	if (utils.queryString.get('nielsen-dcr-debug') === '1') {
		nlsnConfig.nol_sdkDebug = 'debug';
	}

	return window.NOLBUNDLE.nlsQ(nielsenKey, 'nlsnInstance', nlsnConfig);
}

/**
 * Nielsen service handler
 */
export class Nielsen extends BaseServiceSetup {
	nlsnInstance: any = null;

	/**
	 * Create Nielsen Static Queue and make a call
	 * @returns {Object}
	 */
	call(): void {
		const targeting = context.get('targeting');
		const section = context.get('services.nielsen.customSection') || targeting.s0v;
		const articleId = targeting.post_id || targeting.artid;

		if (!this.isEnabled('icNielsen', false) || !nielsenKey) {
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

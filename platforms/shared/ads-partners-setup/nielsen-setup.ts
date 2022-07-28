import { BaseServiceSetup, context, Dictionary, utils } from '@wikia/ad-engine';
// eslint-disable-next-line no-restricted-imports
import { initNielsenStaticQueue } from '../../../src/ad-services/nielsen/static-queue-script';

const logGroup = 'nielsen-dcr';
const nlsnConfig: Dictionary = {};

function createInstance(nielsenKey): any {
	utils.logger(logGroup, 'loading');

	initNielsenStaticQueue();

	return window.NOLBUNDLE.nlsQ(nielsenKey, 'nlsnInstance', nlsnConfig);
}

class NielsenSetup extends BaseServiceSetup {
	nlsnInstance: any = null;

	constructor() {
		super();
		if (utils.queryString.get('nielsen-dcr-debug') === '1') {
			nlsnConfig.nol_sdkDebug = 'debug';
		}
	}

	initialize() {
		const nielsenKey = context.get('services.nielsen.appId');
		if (!context.get('services.nielsen.enabled') || !nielsenKey) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			if (!this.nlsnInstance) {
				this.nlsnInstance = createInstance(nielsenKey);
			} else {
				utils.logger(logGroup, 'ready');
				this.nlsnInstance.ggPM('staticstart', this.metadata);
				utils.logger(logGroup, 'called', this.metadata);
				return this.nlsnInstance;
			}
			this.res();
		}
	}
}

export const nielsenSetup = new NielsenSetup();

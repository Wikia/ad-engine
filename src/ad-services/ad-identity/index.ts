import { BaseServiceSetup, context } from '@ad-engine/core';
import { logger } from '../../ad-engine/utils';

class AdIdentity extends BaseServiceSetup {
	logGroup = 'AdIdentity';
	async setupPPID(): Promise<void> {
		logger(this.logGroup, 'Awaiting for SS SDK');
		logger(this.logGroup, 'SS SDK ready');
		if (window.SilverSurferSDK?.requestUserPPID) {
			window.SilverSurferSDK.requestUserPPID(context.get('services.ppidAdmsStorage.enabled'));
		}
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			await this.setupPPID();
		}
	}
}

export const adIdentity = new AdIdentity();

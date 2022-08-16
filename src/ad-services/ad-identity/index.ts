import { BaseServiceSetup, context } from '@ad-engine/core';
import { logger } from '../../ad-engine/utils';

class AdIdentity extends BaseServiceSetup {
	logGroup = 'AdIdentity';
	async setupPPID(): Promise<void> {
		logger(this.logGroup, 'Calling PPID in SS');
		if (window.SilverSurferSDK?.requestUserPPID) {
			const ppid = await window.SilverSurferSDK.requestUserPPID(
				context.get('services.ppidAdmsStorage.enabled'),
			);
			context.set('targeting.ppid', ppid);
		}
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			await this.setupPPID();
		}
	}
}

export const adIdentity = new AdIdentity();

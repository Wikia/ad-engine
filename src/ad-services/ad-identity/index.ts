import { BaseServiceSetup, context } from '@ad-engine/core';
import { logger } from '../../ad-engine/utils';

class AdIdentity extends BaseServiceSetup {
	logGroup = 'AdIdentity';
	async setupPPID(): Promise<void> {
		logger(this.logGroup, 'Calling PPID in SS');
		if (window.SilverSurferSDK?.requestUserPPID) {
			logger(this.logGroup, 'ADMS: ', context.get('services.ppidAdmsStorage.enabled'));
			const ppid = await window.SilverSurferSDK.requestUserPPID(
				context.get('services.ppidAdmsStorage.enabled'),
			);
			logger(this.logGroup, 'Setting PPID from SS');
			context.set('targeting.ppid', ppid);
		}
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			await this.setupPPID();
			logger(this.logGroup, 'PPID Set up ');
		}
	}
}

export const adIdentity = new AdIdentity();

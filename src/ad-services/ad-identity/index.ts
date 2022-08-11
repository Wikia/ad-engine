import { BaseServiceSetup, context } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { logger, WaitFor } from '../../ad-engine/utils';

class AdIdentity extends BaseServiceSetup {
	logGroup = 'AdIdentity';
	async setupPPID(): Promise<void> {
		logger(this.logGroup, 'Awaiting for SS SDK');
		const SilverSurferAwaitTime = 50;
		const SilverSurferAvailabilityTries = 100;
		await new WaitFor(
			() => window.SilverSurferSDK && window.SilverSurferSDK.isInitialized(),
			SilverSurferAvailabilityTries,
			0,
			SilverSurferAwaitTime,
		);
		logger(this.logGroup, 'SS SDK ready');
		if (window.SilverSurferSDK?.requestUserPPID) {
			communicationService.on(eventsRepository.IDENTITY_RESOLUTION_PPID_UPDATED, ({ ppid }) => {
				logger(this.logGroup, 'Got PPID' + ppid);
				context.set('targeting.ppid', ppid);
			});

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

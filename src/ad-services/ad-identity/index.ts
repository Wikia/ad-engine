import { BaseServiceSetup, context } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { WaitFor } from '../../ad-engine/utils';

class AdIdentity extends BaseServiceSetup {
	async setupPPID(): Promise<void> {
		const SilverSurferAwaitTime = 50;
		const SilverSurferAvailabilityTries = 3;
		await new WaitFor(
			() => window.SilverSurferSDK && window.SilverSurferSDK.isInitialized(),
			SilverSurferAvailabilityTries,
			0,
			SilverSurferAwaitTime,
		);
		if (window.SilverSurferSDK?.requestUserPPID) {
			communicationService.on(eventsRepository.IDENTITY_RESOLUTION_PPID_UPDATED, ({ ppid }) => {
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

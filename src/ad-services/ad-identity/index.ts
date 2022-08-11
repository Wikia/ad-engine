import { BaseServiceSetup, context } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';
import { WaitFor } from '../../ad-engine/utils';

class AdIdentity extends BaseServiceSetup {
	async setupPPID(): Promise<void> {
		console.log('DJ: Awaiting for SS SDK');
		const SilverSurferAwaitTime = 50;
		const SilverSurferAvailabilityTries = 100;
		await new WaitFor(
			() => window.SilverSurferSDK && window.SilverSurferSDK.isInitialized(),
			SilverSurferAvailabilityTries,
			0,
			SilverSurferAwaitTime,
		);
		console.log('DJ: SS SDK ready');
		if (window.SilverSurferSDK?.requestUserPPID) {
			communicationService.on(eventsRepository.IDENTITY_RESOLUTION_PPID_UPDATED, ({ ppid }) => {
				console.log('DJ: Got PPID', ppid);
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

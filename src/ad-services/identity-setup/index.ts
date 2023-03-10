import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, utils } from '@ad-engine/core';

export class IdentitySetup extends BaseServiceSetup {
	private logGroup = 'IdentitySetup';
	private identityReady: () => void;

	call(): Promise<void> {
		if (!this.isEnabled('icPpid', false)) {
			utils.logger(this.logGroup, 'disabled');
			const identityPromise = new Promise<void>((res) => {
				this.identityReady = res;
			});

			communicationService.on(eventsRepository.IDENTITY_ENGINE_READY, this.identityReady);
			return identityPromise;
		}

		return Promise.resolve();
	}
}

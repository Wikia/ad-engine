import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, utils } from '@ad-engine/core';

export class IdentitySetup extends BaseServiceSetup {
	private logGroup = 'identity-setup';
	private identityReady: () => void;
	private fallback = setTimeout(() => {
		utils.logger(this.logGroup, 'Fallback launched');
		this.identityReady();
	}, 2500);

	call(): Promise<void> {
		const identityPromise = new Promise<void>((res) => {
			this.identityReady = res;
		});

		communicationService.on(eventsRepository.IDENTITY_ENGINE_READY, () => {
			this.identityReady();
			clearTimeout(this.fallback);
			utils.logger(this.logGroup, 'initialized');
		});
		return identityPromise;
	}
}

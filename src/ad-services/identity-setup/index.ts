import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, globalContextService, targetingService, utils } from '@ad-engine/core';

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
			const ppid = globalContextService.getValue('tracking', 'ppid');
			if (ppid) {
				targetingService.set('ppid', ppid);
			}
			clearTimeout(this.fallback);
			utils.logger(this.logGroup, 'initialized');
			this.identityReady();
		});
		return identityPromise;
	}
}

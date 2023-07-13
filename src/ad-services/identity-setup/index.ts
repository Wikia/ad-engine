import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	BaseServiceSetup,
	context,
	globalContextService,
	targetingService,
	utils,
} from '@ad-engine/core';

export class IdentitySetup extends BaseServiceSetup {
	private logGroup = 'identity-setup';

	async call(): Promise<void> {
		utils.logger(this.logGroup, 'initializing');

		await this.identityEngineReady();
		utils.logger(this.logGroup, 'initialized');

		return Promise.resolve();
	}

	async identityEngineReady(): Promise<void> {
		return new Promise<void>((resolve) => {
			communicationService.on(eventsRepository.IDENTITY_ENGINE_READY, () => {
				const ppid = globalContextService.getValue('tracking', 'ppid');
				if (ppid) {
					targetingService.set('ppid', ppid);
				}

				if (context.get('services.identityPartners')) {
					const segments = globalContextService.getValue('targeting', 'AU_SEG');
					targetingService.set('AU_SEG', segments);
				}

				utils.logger(this.logGroup, 'ready');
				resolve();
			});
		});
	}
}

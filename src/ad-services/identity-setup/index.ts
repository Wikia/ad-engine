import { communicationService, eventsRepository } from '@ad-engine/communication';
import {
	BaseServiceSetup,
	context,
	DiProcess,
	globalContextService,
	targetingService,
	utils,
} from '@ad-engine/core';

export class IdentitySetup extends BaseServiceSetup implements DiProcess {
	private logGroup = 'identity-setup';

	async execute(): Promise<void> {
		utils.logger(this.logGroup, 'initialized');

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

			communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, () => {
				const over18 = window.fandomContext.tracking.over_18;

				if (over18) {
					targetingService.set('over_18', over18);
				}
			});
		});
	}
}

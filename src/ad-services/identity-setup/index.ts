import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, DiProcess, globalContextService, targetingService, utils } from '@ad-engine/core';

export class IdentitySetup implements DiProcess {
	private logGroup = 'identity-setup';

	execute(): void {
		utils.logger(this.logGroup, 'initialized');

		this.setupIdentityEngineReady();
		this.setupOver18Targeting();
	}

	setupIdentityEngineReady(): void {
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
		});
	}

	setupOver18Targeting(): void {
		communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, () => {
			const over18 = window.fandomContext.tracking.over_18;

			if (over18) {
				targetingService.set('over_18', over18);
			}
		});
	}
}

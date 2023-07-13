import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, targetingService } from '@ad-engine/core';

export class CoppaSetup extends BaseServiceSetup {
	async call(): Promise<void> {
		await new Promise<void>((resolve) => {
			communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, () => {
				const over18 = window.fandomContext.tracking.over_18;

				if (over18) {
					targetingService.set('over_18', over18);
				}
				resolve();
			});
		});
	}
}

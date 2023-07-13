import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, targetingService, utils } from '@ad-engine/core';

export class CoppaSetup extends BaseServiceSetup {
	private logGroup = 'Coppa Setup';
	async call(): Promise<void> {
		utils.logger(this.logGroup, 'initializing');
		await new Promise<void>((resolve) => {
			communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, () => {
				const over18 = window.fandomContext.tracking.over_18;

				if (over18) {
					targetingService.set('over_18', over18);
				}
				utils.logger(this.logGroup, 'initialized');
				resolve();
			});
		});
	}
}

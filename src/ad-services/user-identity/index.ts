import { BaseServiceSetup, context, utils } from '@ad-engine/core';

export class UserIdentity extends BaseServiceSetup {
	public static logGroup = 'user-identity';

	async setupPPID(): Promise<void> {
		// try {
		// 	const strategy = context.get('services.ppidRepository');
		// 	const ppid = await this.getPPID(strategy).get();
		// 	communicationService.emit(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
		// 		partnerName: 'Google',
		// 		partnerIdentityId: ppid,
		// 	});
		// 	targetingService.set('ppid', ppid);
		// 	utils.logger(UserIdentity.logGroup, 'Passed PPID to page-level targeting');
		// } catch (e) {
		// 	utils.logger(UserIdentity.logGroup, 'Setting up PPID has failed!', e);
		// }
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			utils.logger(UserIdentity.logGroup, 'enabled - awaiting setup');
			await this.setupPPID();
		} else {
			utils.logger(UserIdentity.logGroup, 'disabled');
		}
	}
}

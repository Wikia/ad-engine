import { context, ServiceStage } from '@ad-engine/core';
// eslint-disable-next-line no-restricted-imports
import { Service } from '@ad-engine/services';

@Service({
	stage: ServiceStage.baseSetup,
})
class UserIdentity {
	async setupPPID(): Promise<void> {
		if (window.SilverSurferSDK?.requestUserPPID) {
			const ppid = await window.SilverSurferSDK.requestUserPPID(
				context.get('services.ppidAdmsStorage.enabled'),
			);
			context.set('targeting.ppid', ppid);
		}
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			await this.setupPPID();
		}
	}
}

export const userIdentity = new UserIdentity();

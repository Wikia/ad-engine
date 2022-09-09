import { BaseServiceSetup, context } from '@ad-engine/core';
import { v4 as uuid } from 'uuid';
import { communicationService, eventsRepository } from '@ad-engine/communication';

export class UserIdentity extends BaseServiceSetup {
	private get ADMS_AVAILABLE(): boolean {
		return (
			window.SilverSurferSDK?.requestUserPPID && context.get('services.ppidAdmsStorage.enabled')
		);
	}

	private generatePPID() {
		const ppid: string = uuid();
		localStorage.setItem('ppid', uuid);
		communicationService.dispatch({
			type: eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED,
			payload: {
				partnerName: 'Google',
				partnerIdentityId: ppid,
			},
		});
		if (this.ADMS_AVAILABLE) {
			window.SilverSurferSDK.saveUserPPID(ppid);
		}

		return ppid;
	}

	private async getPPID(): Promise<string> {
		let ppid: string;
		if (this.ADMS_AVAILABLE) {
			ppid = await window.SilverSurferSDK.requestUserPPID();
			if (ppid) {
				return ppid;
			}
		}
		return localStorage.getItem('ppid') || this.generatePPID();
	}

	async setupPPID(): Promise<void> {
		context.set('targeting.ppid', await this.getPPID());
	}

	async call(): Promise<void> {
		if (context.get('services.ppid.enabled')) {
			await this.setupPPID();
		}
	}
}

export const userIdentity = new UserIdentity();

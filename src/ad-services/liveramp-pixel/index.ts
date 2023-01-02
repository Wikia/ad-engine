import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, utils } from '@ad-engine/core';

export class LiveRampPixel extends BaseServiceSetup {
	private PIXEL_ID = 712315;
	private logGroup = 'LiveRamp';
	private PIXEL_URL = `https://idsync.rlcdn.com/${this.PIXEL_ID}.gif?partner_uid=`;

	insertLiveRampPixel(token): void {
		const element = document.createElement('img');
		element.src = this.PIXEL_URL + token;
		document.body.appendChild(element);
	}

	async call(): Promise<void> {
		if (!this.isEnabled('services.liveRampPixel.enabled')) {
			utils.logger(this.logGroup, 'pixel disabled');
			return;
		}
		communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, (event) => {
			if (event.payload.partnerName === 'Google') {
				this.insertLiveRampPixel(event.payload.partnerIdentityId);
			}
		});
	}
}

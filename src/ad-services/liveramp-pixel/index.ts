import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { assetLoader, logger } from '@ad-engine/utils';

export class LiveRampPixel extends BaseServiceSetup {
	private PIXEL_ID = 712315;
	private logGroup = 'LiveRamp pixel';
	private PIXEL_URL = `https://idsync.rlcdn.com/${this.PIXEL_ID}.gif?partner_uid=`;

	insertLiveRampPixel(token): void {
		const pixelUrl = this.PIXEL_URL + token;
		assetLoader.loadPixel(pixelUrl);
	}

	async call(): Promise<void> {
		if (!this.isEnabled('icLiveRampPixel')) {
			logger(this.logGroup, 'pixel disabled');
			return;
		}

		communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, (event) => {
			if (event.payload.partnerName === 'Google') {
				this.insertLiveRampPixel(event.payload.partnerIdentityId);
			}
		});
	}
}

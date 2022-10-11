import { BaseServiceSetup, context, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

class LiveRampPixel extends BaseServiceSetup {
	private PIXEL_ID = 712315;
	private logGroup = 'LiveRamp';
	private PIXEL_URL = `https://idsync.rlcdn.com/${this.PIXEL_ID}.gif?partner_uid=`;

	private isEnabled(): boolean {
		return (
			context.get('services.liveRampPixel.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	insertLiveRampPixel(token): void {
		const element = document.createElement('img');
		element.src = this.PIXEL_URL + token;
		element.onload = () => {
			communicationService.emit(eventsRepository.LIVE_RAMP_LOADED);
			utils.logger(this.logGroup, 'Loaded pixel');
		};
		element.onerror = () => {
			communicationService.emit(eventsRepository.LIVE_RAMP_FAILED);
			utils.logger(this.logGroup, 'Failed to load pixel');
		};
		document.body.appendChild(element);
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'pixel disabled');
			return;
		}
		communicationService.emit(eventsRepository.LIVE_RAMP_STARTED);

		communicationService.on(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, (event) => {
			if (event.payload.partnerName === 'Google') {
				this.insertLiveRampPixel(event.payload.partnerIdentityId);
			}
		});
	}
}

export const liveRampPixel = new LiveRampPixel();

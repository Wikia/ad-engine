import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, targetingService, utils } from '@ad-engine/core';

const partnerName = 'experian';
const logGroup = partnerName;

export class Experian extends BaseServiceSetup {
	private PARTNER_ID = 3442;
	private PIXEL_URL = `https://pixel.tapad.com/idsync/ex/receive
		?partner_id=${this.PARTNER_ID}&partner_device_id=`;

	call(): void {
		if (!this.isEnabled('icExperian')) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		this.insertExperianPixel();
	}

	private getExperianPixelUrl(): string {
		const ppid = targetingService.get('ppid');

		return this.PIXEL_URL + ppid;
	}

	insertExperianPixel(): void {
		communicationService.emit(eventsRepository.EXPERIAN_STARTED);
		utils.assetLoader.loadPixel(this.getExperianPixelUrl());
	}
}

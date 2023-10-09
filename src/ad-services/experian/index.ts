import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, targetingService, utils } from '@ad-engine/core';

const partnerName = 'experian';
const logGroup = partnerName;

export class Experian extends BaseServiceSetup {
	private PARTNER_ID = 3442;

	call(): void {
		if (!this.isEnabled('icExperian')) {
			utils.logger(logGroup, 'disabled');
			return;
		}
		this.insertExperianPixel();
	}

	private getExperianPixelUrl(): string {
		const ppid = targetingService.get('ppid');

		return `https://pixel.tapad.com/idsync/ex/receive
		?partner_id=${this.PARTNER_ID}&partner_device_id=${ppid}`;
	}

	insertExperianPixel(): void {
		const element = document.createElement('img');
		element.src = this.getExperianPixelUrl();
		element.onload = (): void => {
			communicationService.emit(eventsRepository.EXPERIAN_LOADED);
		};
		communicationService.emit(eventsRepository.EXPERIAN_STARTED);
		document.body.appendChild(element);
	}
}

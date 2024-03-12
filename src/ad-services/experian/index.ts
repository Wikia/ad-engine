import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, targetingService } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { assetLoader, logger } from '@ad-engine/utils';

const partnerName = 'experian';
const logGroup = partnerName;

export class Experian extends BaseServiceSetup {
	private PARTNER_ID = 3442;
	private PARTNER_URL_CORE =
		'https://services.fandom.com/identity-storage' + '/external/experian/receiveid';
	private EXPERIAN_URL = 'https://pixel.tapad.com/idsync/ex/receive';

	call(): void {
		if (!this.isEnabled('icExperian')) {
			logger(logGroup, 'disabled');
			return;
		}
		this.insertExperianPixel();
	}

	private getExperianPixelUrl(): string {
		const ppid = targetingService.get('ppid');
		const pv_unique_id = context.get('wiki.pvUID');
		const partner_url = `${this.PARTNER_URL_CORE}/${pv_unique_id}?id=\${TA_DEVICE_ID}
			&partner=TAPAD`;

		return `${this.EXPERIAN_URL}?partner_id=${this.PARTNER_ID}
		&partner_device_id=${ppid}&partner_url=${partner_url}`;
	}

	insertExperianPixel(): void {
		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'experian_started',
		});
		assetLoader.loadPixel(this.getExperianPixelUrl());
	}
}

import { getMediaWikiVariable } from '../utils/get-media-wiki-variable';
import Cookies from 'js-cookie';
import { AdSlot, externalLogger } from '@wikia/ad-engine';

const cookies = Cookies.get();

export class KibanaLogger {
	logEntry = {};

	constructor() {
		this.logEntry['smLogId'] =
			getMediaWikiVariable('beaconId') ||
			window.beaconId ||
			window.beacon_id ||
			cookies['wikia_beacon_id'];
	}

	recordRequestTargeting(targeting) {
		this.logEntry['smTarSequential'] =
			targeting.sequential !== undefined ? targeting.sequential : '';
	}

	recordGAMCreativePayload(payload) {
		this.logEntry['smGamHeight'] = payload.height !== undefined ? payload.height : '';
		this.logEntry['smGamLineItemId'] = payload.lineItemId !== undefined ? payload.lineItemId : '';
		this.logEntry['smGamWidth'] = payload.width !== undefined ? payload.width : '';
	}

	recordRenderedAd(adSlot: AdSlot) {
		this.logEntry['smRenCreativeId'] = adSlot.creativeId;
		this.logEntry['smRenLineItemId'] = adSlot.lineItemId;
		this.logEntry['smRenSlotName'] = adSlot.getSlotName();

		if (this.logEntry['smTarSequential'] !== undefined) {
			this.logEntry['smOK'] =
				this.logEntry['smTarSequential'] == this.logEntry['smRenLineItemId'].toString();
		}

		externalLogger.log('sequential messaging', this.logEntry);

		delete window['smTracking'];
	}
}

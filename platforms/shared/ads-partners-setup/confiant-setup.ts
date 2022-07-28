import { context, slotService, utils } from '@wikia/ad-engine';
import { BaseServiceSetup } from '@wikia/ad-engine';

const logGroup = 'confiant';
const scriptDomain = 'confiant-integrations.global.ssl.fastly.net';

/**
 * Injects Confiant script
 * @returns {Promise}
 */
function loadScript(propertyId: string): Promise<Event> {
	const confiantLibraryUrl = `//${scriptDomain}/${propertyId}/gpt_and_prebid/config.js`;

	return utils.scriptLoader.loadScript(confiantLibraryUrl, 'text/javascript', true, 'first');
}

/**
 * Confiant blocking callback tracking parameters to DW
 */
function trackBlock(blockingType, blockingId, isBlocked, wrapperId, tagId, impressionData): void {
	if (impressionData && impressionData.dfp) {
		const slotName = impressionData.dfp.s;
		const adSlot = slotService.get(slotName);

		if (adSlot) {
			adSlot.emitEvent(`confiant-${blockingType}`);
		}
	}
}

/**
 * Confiant service handler
 */
class ConfiantSetup extends BaseServiceSetup {
	initialize() {
		const propertyId: string = context.get('services.confiant.propertyId');

		if (!context.get('services.confiant.enabled') || !propertyId) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			utils.logger(logGroup, 'loading');

			window.confiant = window.confiant || {};
			window.confiant.callback = trackBlock;

			loadScript(propertyId).then(() => {
				utils.logger(logGroup, 'ready');
				this.res();
			});
		}
	}
}

export const confiantSetup = new ConfiantSetup();

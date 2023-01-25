import { BaseServiceSetup, slotService, utils } from '@ad-engine/core';

const logGroup = 'confiant';
const scriptDomain = 'cdn.confiant-integrations.net';
const propertyId = 'd-aIf3ibf0cYxCLB1HTWfBQOFEA';

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
export class Confiant extends BaseServiceSetup {
	/**
	 * Requests service and injects script tag
	 * @returns {Promise}
	 */
	call(): Promise<void> {
		if (!this.isEnabled('icConfiant', false) || !propertyId) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');

		window.confiant = window.confiant || {};
		window.confiant.callback = trackBlock;

		return loadScript(propertyId).then(() => {
			utils.logger(logGroup, 'ready');
		});
	}
}

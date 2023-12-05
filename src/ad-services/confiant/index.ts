import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, slotService, utils } from '@ad-engine/core';

const logGroup = 'confiant';

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
	protected scriptDomain = 'cdn.confiant-integrations.net';
	protected propertyId = 'd-aIf3ibf0cYxCLB1HTWfBQOFEA';

	/**
	 * Requests service and injects script tag
	 * @returns {Promise}
	 */
	call(): Promise<void> {
		if (!this.isEnabled('icConfiant', false)) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
			status: 'confiant_start',
		});

		this.overwritePropertyIdIfPresent();

		utils.logger(logGroup, 'loading');

		window.confiant = window.confiant || {};
		window.confiant.callback = trackBlock;

		return this.loadScript().then(() => {
			utils.logger(logGroup, 'ready');
			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'confiant_done',
			});
		});
	}

	private overwritePropertyIdIfPresent() {
		const contextPropertyId = context.get('services.confiant.propertyId');

		this.propertyId = contextPropertyId ? contextPropertyId : this.propertyId;
	}

	private loadScript(): Promise<Event> {
		const confiantLibraryUrl = `//${this.scriptDomain}/${this.propertyId}/gpt_and_prebid/config.js`;

		return utils.scriptLoader.loadScript(confiantLibraryUrl, true, 'first');
	}
}

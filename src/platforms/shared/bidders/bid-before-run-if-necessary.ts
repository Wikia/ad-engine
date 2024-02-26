import { communicationService, context, eventsRepository, utils } from '@wikia/ad-engine';

const logGroup = 'bid-before-run';

export function bidBeforeRunIfNecessary(slotName: string, callback: () => void) {
	const bidBeforeRun = !!context.get(`slots.${slotName}.bidBeforeRun`);
	const bidGroup = context.get(`slots.${slotName}.bidGroup`);
	const experimentEnabled = !!context.get('custom.bidAuctionSplitEnabled');

	if (bidBeforeRun && bidGroup && experimentEnabled) {
		utils.logger(logGroup, `Bid before push ${slotName}`);

		communicationService.emit(eventsRepository.BIDDERS_CALL_PER_GROUP, {
			group: bidGroup,
			callback: () => {
				callback();
			},
		});
	} else {
		callback();
	}
}

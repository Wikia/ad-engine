import { communicationService, context, eventsRepository, utils } from '@wikia/ad-engine';

const logGroup = 'bid-before-push';
const experimentEnabled = true;

export function bidBeforePush(slotName: string, callback: () => void) {
	const bidBeforePush = !!context.get(`slots.${slotName}.bidBeforePush`);
	const bidGroup = context.get(`slots.${slotName}.bidGroup`);

	if (bidBeforePush && bidGroup && experimentEnabled) {
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

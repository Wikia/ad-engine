import { bidders, events, eventService, utils } from '@wikia/ad-engine';

const logGroup = 'ad-engine';

export function configureEventService(): void {
	eventService.on(events.AD_SLOT_CREATED, (slot) => {
		utils.logger(logGroup, `Created ad slot ${slot.getSlotName()}`);
		bidders.updateSlotTargeting(slot.getSlotName());
	});
}

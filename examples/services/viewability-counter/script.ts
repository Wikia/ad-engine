import {
	AdEngine,
	AdSlot,
	context,
	events,
	eventService,
	viewabilityCounter,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);

eventService.on(events.AD_SLOT_CREATED, (slot: AdSlot) => {
	slot.loaded.then(() => {
		viewabilityCounter.updateStatus('loaded', slot.getSlotName());
	});

	slot.viewed.then(() => {
		viewabilityCounter.updateStatus('viewed', slot.getSlotName());
	});
});

console.info(`👀 Overall viewability: ${viewabilityCounter.getViewability()}`);
console.info(`👀 TLB viewability: ${viewabilityCounter.getViewability('top_leaderboard')}`);
console.info(`👀 BLB viewability: ${viewabilityCounter.getViewability('bottom_leaderboard')}`);

new AdEngine().init();

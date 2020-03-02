import {
	AdEngine,
	bidders,
	context,
	events,
	eventService,
	setupNpaContext,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);
context.set('state.provider', 'prebidium');

setupNpaContext();

context.set('options.maxDelayTimeout', 1000);

const biddersInhibitor = bidders.requestBids();

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

new AdEngine().init([biddersInhibitor]);

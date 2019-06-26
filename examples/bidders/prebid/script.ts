import {
	AdEngine,
	bidders,
	context,
	DelayModule,
	events,
	eventService,
	setupNpaContext,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);

setupNpaContext();

let resolveBidders;

const biddersDelay: DelayModule = {
	isEnabled: () => true,
	getName: () => 'bidders-delay',
	getPromise: () =>
		new Promise((resolve) => {
			resolveBidders = resolve;
		}),
};

context.push('delayModules', biddersDelay);

bidders.requestBids({
	responseListener: () => {
		if (bidders.hasAllResponses()) {
			if (resolveBidders) {
				resolveBidders();
				resolveBidders = null;
			}
		}
	},
});

bidders
	.runOnBiddingReady(() => {
		console.log('⛳ Prebid bidding completed');
	})
	.catch(() => {
		console.log('😡 Prebid bidding timed out');
	});

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

new AdEngine().init();

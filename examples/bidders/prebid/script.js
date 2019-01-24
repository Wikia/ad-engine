import { AdEngine, context, events } from '@wikia/ad-engine';
import { bidders } from '@wikia/ad-bidders';
import { utils as adProductsUtils } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);

adProductsUtils.setupNpaContext();

let resolveBidders;

const biddersDelay = {
	isEnabled: () => true,
	getName: () => 'bidders-delay',
	getPromise: () =>
		new Promise((resolve) => {
			resolveBidders = resolve;
		}),
};

context.set('options.maxDelayTimeout', 1000);
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

bidders.runOnBiddingReady(() => {
	console.log('⛳ Prebid bidding completed');
});

events.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

new AdEngine().init();

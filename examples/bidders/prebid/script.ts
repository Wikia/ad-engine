import {
	AdBidderContext,
	AdEngine,
	AdInfoContext,
	bidders,
	bidderTracker,
	bidderTrackingMiddleware,
	context,
	events,
	eventService,
	setupNpaContext,
	setupRdpContext,
	slotBiddersTrackingMiddleware,
	slotBillTheLizardStatusTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	utils,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

const sendAllBidsEnabled = utils.queryString.get('send_all_bids') === '1';
const prebidVersion = utils.queryString.get('prebid-version');

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);
context.set('bidders.prebid.sendAllBids', sendAllBidsEnabled);

if (prebidVersion) {
	context.set(
		'bidders.prebid.libraryUrl',
		`https://static.wikia.nocookie.net/fandom-ae-assets/prebid.js/${prebidVersion}`,
	);
}

setupNpaContext();
setupRdpContext();

const biddersInhibitor = bidders
	.requestBids()
	.then(() => console.log('⛳ Prebid bidding completed'));

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

// Tracking
context.set('options.tracking.slot.status', true);
context.set('options.tracking.slot.bidder', true);

slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.add(slotBiddersTrackingMiddleware)
	.add(slotBillTheLizardStatusTrackingMiddleware)
	.register(async ({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);

		return { data, slot };
	});

bidderTracker.add(bidderTrackingMiddleware).register(async ({ bid, data }: AdBidderContext) => {
	// Trigger bidder tracking
	console.info(`🏁 Bidder tracker: ${bid.bidderName} for ${bid.slotName}`, bid, data);

	return { bid, data };
});

new AdEngine().init([biddersInhibitor]);

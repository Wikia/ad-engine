import {
	AdBidderContext,
	AdEngine,
	AdInfoContext,
	bidders,
	bidderTracker,
	bidderTrackingMiddleware,
	cmp,
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
const optIn = utils.queryString.get('tracking-opt-in-status') !== '0';

cmp.override((cmd, param, cb) => {
	if (cmd === 'getConsentData') {
		cb(
			{
				consentData: optIn
					? 'BOQu5jyOQu5jyCNABAPLBR-AAAAeCAFgAUABYAIAAaABFACY'
					: 'BOQu5naOQu5naCNABAPLBRAAAAAeCAAA',
				gdprApplies: true,
				hasGlobalScope: false,
			},
			true,
		);
	} else if (cmd === 'getVendorConsents') {
		cb(
			{
				metadata: 'BOQu5naOQu5naCNABAAABRAAAAAAAA',
				purposeConsents: Array.from({ length: 5 }).reduce<ConsentData['purposeConsents']>(
					(map, val, i) => ({ ...map, [i + 1]: optIn }),
					{},
				),
				vendorConsents: Array.from({ length: 500 }).reduce<ConsentData['vendorConsents']>(
					(map, val, i) => ({ ...map, [i + 1]: optIn }),
					{},
				),
			},
			true,
		);
	} else {
		cb(null, false);
	}
});

context.extend(customContext);
context.set('slots.bottom_leaderboard.disabled', false);
context.set(
	'bidders.prebid.libraryUrl',
	'https://origin-images.wikia.com/fandom-ae-assets/prebid.js/v2.44.1/20200103.min.js',
);
context.set('bidders.prebid.sendAllBids', sendAllBidsEnabled);

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
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

bidderTracker.add(bidderTrackingMiddleware).register(({ bid, data }: AdBidderContext) => {
	// Trigger bidder tracking
	console.info(`🏁 Bidder tracker: ${bid.bidderCode} for ${bid.adUnitCode}`, bid, data);
});

new AdEngine([biddersInhibitor]).init();

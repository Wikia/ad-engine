import {
	AdBidderContext,
	AdEngine,
	AdInfoContext,
	bidders,
	bidderTracker,
	bidderTrackingMiddleware,
	cmp,
	context,
	DelayModule,
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
context.set('bidders.prebid.sendAllBids', sendAllBidsEnabled);

setupNpaContext();
setupRdpContext();

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

new AdEngine().init();

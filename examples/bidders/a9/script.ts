import {
	AdBidderContext,
	AdEngine,
	Apstag,
	bidders,
	bidderTracker,
	bidderTrackingMiddleware,
	cmp,
	context,
	events,
	eventService,
	setupNpaContext,
	setupRdpContext,
	utils,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

const optIn = utils.queryString.get('tracking-opt-in-status') !== '0';
const apstag = Apstag.make();

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
context.set('targeting.artid', '266');
context.set('slots.incontent_boxad.disabled', false);
context.set('bidders.a9.dealsEnabled', utils.queryString.get('deals') === '1');
context.set('bidders.a9.bidsRefreshing.enabled', utils.queryString.get('refreshing') === '1');
context.set('bidders.a9.bidsRefreshing.slots', ['incontent_boxad']);
context.set('options.tracking.slot.bidder', true);

setupNpaContext();
setupRdpContext();

context.set('options.maxDelayTimeout', 1000);

bidderTracker.add(bidderTrackingMiddleware).register(async ({ bid, data }: AdBidderContext) => {
	// Trigger bidder tracking
	console.info(`🏁 Bidder tracker: ${bid.bidderName} for ${bid.slotName}`, bid, data);

	return { bid, data };
});

const biddersInhibitor = bidders.requestBids().then(() => {
	console.log('⛳ Prebid bidding completed');
});

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

// @ts-ignore
window.bidders = bidders;

document.getElementById('enableDebugMode').addEventListener('click', () => {
	apstag.enableDebug();
	window.location.reload();
});

document.getElementById('disableDebugMode').addEventListener('click', () => {
	apstag.disableDebug();
	window.location.reload();
});

new AdEngine().init([biddersInhibitor]);

window.adsQueue.push({
	id: 'repeatable_boxad_1',
});

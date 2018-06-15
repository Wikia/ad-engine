// import A9 from './a9/index';
import { Prebid } from './prebid/index';


require('./../../lib/prebid.min');

const bidIndex = {
	a9: {
		pos: 2,
		char: '9'
	},
	prebid: {
		pos: 4,
		char: 'P'
	}
};

let bidderMarker = ['x', 'x', 'x', 'x', 'x'];
const biddersRegistry = {};

function getBidParameters(slotName) {
	let floorPrice = 0;
	const slotParams = {};

	if (biddersRegistry.prebid && biddersRegistry.prebid.wasCalled()) {
		const prebidPrices = biddersRegistry.prebid.getSlotBestPrice(slotName);

		floorPrice = Math.max.apply(
			null,
			Object
				.keys(prebidPrices)
				.filter(key => !isNaN(parseFloat(prebidPrices[key])) && parseFloat(prebidPrices[key]) > 0)
				.map(key => parseFloat(prebidPrices[key]))
		);
	}

	Object.keys(biddersRegistry).forEach((bidderName) => {
		const bidder = biddersRegistry[bidderName];

		if (bidder && bidder.wasCalled()) {
			const params = bidder.getSlotTargetingParams(slotName, floorPrice);

			Object
				.keys(params)
				.forEach((key) => {
					slotParams[key] = params[key];
				});

			if (bidder.hasResponse()) {
				bidderMarker = updateBidderMarker(bidder.getName(), bidderMarker);
			}
		}
	});

	slotParams.bid = bidderMarker.join('');

	return slotParams;
}

function getCurrentSlotPrices(slotName) {
	const slotPrices = {};

	Object.keys(biddersRegistry).forEach((bidder) => {
		bidder = biddersRegistry[bidder];

		if (bidder && bidder.isSlotSupported(slotName)) {
			const priceFromBidder = bidder.getSlotBestPrice(slotName);

			Object.keys(priceFromBidder).forEach((bidderName) => {
				slotPrices[bidderName] = priceFromBidder[bidderName];
			});
		}
	});

	return slotPrices;
}
function requestBids({ config, resetListener, timeout }) {
	if (config.prebid) {
		biddersRegistry.prebid = new Prebid(config.prebid, resetListener, timeout);
		biddersRegistry.prebid.call();
	}

	//if (bidders.a9) {
	//	biddersRegistry.a9 = new A9(bidders.a9, resetListener, timeout);
	//}
}

function updateBidderMarker(bidderName, bidMarker) {
	if (!bidIndex[bidderName]) {
		return bidMarker;
	}

	const bidder = bidIndex[bidderName];
	bidMarker[bidder.pos] = bidder.char;

	return bidMarker;
}

export const bidders = {
	requestBids,
	getBidParameters
};

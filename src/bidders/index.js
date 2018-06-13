// import A9 from './a9/index';
import { Prebid } from './prebid/index';


require('./../../lib/prebid.min');

const logGroup = 'ext.wikia.adEngine.lookup.services';
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

let bidMarker = ['x', 'x', 'x', 'x', 'x'];
let biddersRegistry = {};

function getParameters(slotName) {
	if (!Object.keys) {
		return;
	}

	let slotParams = {};
	let floorPrice = 0;

	if (biddersRegistry.prebid && biddersRegistry.prebid.wasCalled()) {
		const prebidPrices = biddersRegistry.prebid.getBestSlotPrice(slotName);
		// promote prebid on a tie
		floorPrice = Math.max.apply(
			null,
			Object.keys(prebidPrices)
				.filter((key) =>
					!isNaN(parseFloat(prebidPrices[key])) && parseFloat(prebidPrices[key]) > 0)
				.map((key) => parseFloat(prebidPrices[key]))
		);
	}

	Object.keys(biddersRegistry).forEach(function (bidderName) {
		const bidder = biddersRegistry[bidderName];

		if (bidder && bidder.wasCalled()) {
			const params = bidder.getSlotParams(slotName, floorPrice);

			Object.keys(params).forEach(function (key) {
				slotParams[key] = params[key];
			});

			if (bidder.hasResponse()) {
				bidMarker = updateBidderMarker(bidder.getName(), bidMarker);
			}
		}
	});

	slotParams.bid = bidMarker.join('');

	return slotParams;
}

function updateBidderMarker(bidderName, bidMarker) {
	if (!bidIndex[bidderName]) {
		return bidMarker;
	}

	let bidder = bidIndex[bidderName];
	bidMarker[bidder.pos] = bidder.char;

	return bidMarker;
}

function getCurrentSlotPrices(slotName) {
	const slotPrices = {};

	Object.keys(biddersRegistry).forEach(function (bidderName) {
		const bidder = biddersRegistry[bidderName];

		if (bidder && bidder.isSlotSupported(slotName)) {
			const priceFromBidder = bidder.getBestSlotPrice(slotName);

			Object.keys(priceFromBidder).forEach(function (bidderName) {
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

export const bidders = {
	requestBids
};

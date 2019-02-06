import { context } from '@wikia/ad-engine';
import { transformPriceFromBid } from './price-helper';

const dfpVideoBidders = [
	{ bidderCode: 'appnexusAst', contextKey: 'custom.appnexusDfp' },
	{ bidderCode: 'lkqd', contextKey: 'custom.lkqdDfp' },
	{ bidderCode: 'rubicon', contextKey: 'custom.rubiconDfp' },
	{ bidderCode: 'pubmatic', contextKey: 'custom.pubmaticDfp' },
];

export function getSettings() {
	return {
		standard: {
			alwaysUseBid: false,
			adserverTargeting: [
				{
					key: 'hb_bidder',
					val: ({ bidderCode }) => bidderCode,
				},
				{
					key: 'hb_adid',
					val: ({ adId }) => adId,
				},
				{
					key: 'hb_pb',
					val: (bidResponse) => transformPriceFromBid(bidResponse),
				},
				{
					key: 'hb_size',
					val: ({ size }) => size,
				},
				{
					key: 'hb_uuid',
					val: (bidResponse) => getBidderUuid(bidResponse),
				},
			],
		},
	};
}

function getBidderUuid(bidResponse) {
	const isVideo = dfpVideoBidders.some(
		(video) => bidResponse.bidderCode === video.bidderCode && context.get(video.contextKey),
	);

	return isVideo ? bidResponse.videoCacheKey : 'disabled';
}

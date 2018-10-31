import { AdSlot, buildVastUrl, context, slotService, utils } from '@wikia/ad-engine';
import { BaseAdapter } from './base-adapter';

export class WikiaVideo extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'wikiaVideo';
		this.enabled = !!(utils.queryString.get('wikia_video_adapter'));

		this.create = () => this;
	}

	prepareConfigForAdUnit(code) {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'outstream',
					playerSize: [640, 480]
				}
			},
			bids: [
				{
					bidder: this.bidderName
				}
			]
		};
	}

	getSpec() {
		return {
			code: this.bidderName,
			supportedMediaTypes: ['video']
		};
	}

	getPrice() {
		const price = context.get('bidders.prebid.wikiaVideo.price') || utils.queryString.get('wikia_video_adapter');

		return parseInt(price, 10) / 100;
	}

	getVastUrl(width, height, slotName) {
		return buildVastUrl(width / height, slotName, {
			targetting: {
				pos: slotName,
				passback: this.bidderName
			},
			videoAdUnitId: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.videoAdUnitId`),
			customParams: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.customParams`)
		});
	}

	callBids(bidRequest, addBidResponse, done) {
		window.pbjs.que.push(() => {
			this.addBids(bidRequest, addBidResponse, done);
		});
	}

	addBids(bidRequest, addBidResponse, done) {
		bidRequest.bids.forEach((bid) => {
			const bidResponse = window.pbjs.createBid(1),
				[width, height] = bid.sizes[0],
				slotName = bid.adUnitCode;

			bidResponse.bidderCode = bidRequest.bidderCode;
			bidResponse.cpm = this.getPrice();
			bidResponse.creativeId = 'foo123_wikiaVideoCreativeId';
			bidResponse.ttl = 300;
			bidResponse.mediaType = 'video';
			bidResponse.width = width;
			bidResponse.height = height;
			bidResponse.vastUrl = this.getVastUrl(width, height, slotName);
			bidResponse.videoCacheKey = '123foo_wikiaVideoCacheKey';

			addBidResponse(bid.adUnitCode, bidResponse);
		});
		done();
	}
}

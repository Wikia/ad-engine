import { buildVastUrl, context, utils } from '@wikia/ad-engine';
import { BaseAdapter } from './base-adapter';

const price = utils.queryString.get('wikia_video_adapter');
const limit = parseInt(utils.queryString.get('wikia_adapter_limit'), 10) || 99;
const timeout = parseInt(utils.queryString.get('wikia_adapter_timeout'), 10) || 0;
const useRandomPrice = utils.queryString.get('wikia_adapter_random') === '1';

export class WikiaVideo extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'wikiaVideo';
		this.enabled = !!price;
		this.limit = limit;
		this.useRandomPrice = useRandomPrice;
		this.timeout = timeout;

		this.create = () => this;
	}

	prepareConfigForAdUnit(code) {
		return {
			code,
			mediaTypes: {
				video: {
					context: 'outstream',
					playerSize: [640, 480],
				},
			},
			bids: [
				{
					bidder: this.bidderName,
				},
			],
		};
	}

	getSpec() {
		return {
			code: this.bidderName,
			supportedMediaTypes: ['video'],
		};
	}

	getPrice() {
		if (this.useRandomPrice) {
			return Math.floor(Math.random() * 20);
		}

		return parseInt(price, 10) / 100;
	}

	getVastUrl(width, height, slotName) {
		return buildVastUrl(width / height, slotName, {
			videoAdUnitId: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.videoAdUnitId`),
			customParams: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.customParams`),
		});
	}

	callBids(bidRequest, addBidResponse, done) {
		window.pbjs.que.push(() => {
			this.addBids(bidRequest, addBidResponse, done);
		});
	}

	addBids(bidRequest, addBidResponse, done) {
		setTimeout(() => {
			bidRequest.bids.forEach((bid) => {
				if (this.limit === 0) {
					return;
				}

				const bidResponse = window.pbjs.createBid(1);
				const [width, height] = bid.sizes[0];
				const slotName = bid.adUnitCode;

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
				this.limit -= 1;
			});

			done();
		}, this.timeout);
	}
}

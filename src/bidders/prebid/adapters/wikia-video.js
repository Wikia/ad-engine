import { BaseAdapter } from './base-adapter';
import { buildVastUrl } from './../../../video/vast-url-builder';

export class WikiaVideo extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'wikiaVideo';
		this.price = options.price;
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

	addBids(bidRequest, addBidResponse, done) {
		bidRequest.bids.forEach((bid) => {
			const bidResponse = window.pbjs.createBid(1),
				[width, height] = bid.sizes[0];

			bidResponse.bidderCode = bidRequest.bidderCode;
			bidResponse.cpm = this.price;
			bidResponse.creativeId = 'foo123_wikiaVideoCreativeId';
			bidResponse.ttl = 300;
			bidResponse.mediaType = 'video';
			bidResponse.width = width;
			bidResponse.height = height;
			bidResponse.vastUrl = buildVastUrl(
				bidResponse.width / bidResponse.height,
				bid.adUnitCode,
				{
					src: 'test',
					pos: 'outstream',
					passback: 'wikiaVideo'
				}
			);

			addBidResponse(bid.adUnitCode, bidResponse);
			done();
		});
	}

	create() {
		return {
			callBids: (bidRequest, addBidResponse, done) => {
				window.pbjs.que.push(() => {
					this.addBids(bidRequest, addBidResponse, done);
				});
			},
			getSpec: () => ({
				code: this.bidderName,
				supportedMediaTypes: ['banner']
			})
		};
	}
}

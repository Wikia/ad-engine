import { BaseAdapter } from './base-adapter';
import { buildVastUrl } from './../../../video/vast-url-builder';
import { queryString } from './../../../utils/query-string';

export class WikiaVideo extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'wikiaVideo';
		this.enabled = !!(queryString.get('wikia_video_adapter'));

		if (this.enabled) {
			this.price = this.getPrice();
		}

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
		const price = queryString.get('wikia_video_adapter');

		return parseInt(price, 10) / 100;
	}

	callBids(bidRequest, addBidResponse, done) {
		window.pbjs.que.push(() => {
			this.addBids(bidRequest, addBidResponse, done);
		});
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
}

import { context, Dictionary, pbjsFactory, utils } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';

const price = utils.queryString.get('wikia_video_adapter');
const limit = parseInt(utils.queryString.get('wikia_adapter_limit'), 10) || 99;
const timeout = parseInt(utils.queryString.get('wikia_adapter_timeout'), 10) || 100;
const useRandomPrice = utils.queryString.get('wikia_adapter_random') === '1';

export class WikiaVideo extends PrebidAdapter {
	static bidderName = 'wikiaVideo';
	limit: number;
	useRandomPrice: boolean;
	timeout: number;
	maxCpm = EXTENDED_MAX_CPM;

	constructor(options) {
		super(options);

		this.enabled = !!price;
		this.limit = limit;
		this.timeout = timeout;
		this.useRandomPrice = useRandomPrice;
		this.isCustomBidAdapter = true;
	}

	static getVastUrl(width, height, slotName): string {
		return utils.buildVastUrl(width / height, slotName, {
			videoAdUnitId: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.videoAdUnitId`),
			customParams: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.customParams`),
		});
	}

	get bidderName(): string {
		return WikiaVideo.bidderName;
	}

	prepareConfigForAdUnit(code): PrebidAdUnit {
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
					params: {},
				},
			],
		};
	}

	getSpec(): Dictionary<string | string[]> {
		return {
			code: this.bidderName,
			supportedMediaTypes: ['video'],
		};
	}

	getPrice(): number {
		if (this.useRandomPrice) {
			return Math.floor(Math.random() * 20);
		}

		return parseInt(price, 10) / 100;
	}

	callBids(bidRequest, addBidResponse, done): void {
		this.addBids(bidRequest, addBidResponse, done);
	}

	addBids(bidRequest, addBidResponse, done): void {
		bidRequest.bids.forEach((bid) => {
			setTimeout(async () => {
				const pbjs: Pbjs = await pbjsFactory.init();

				if (this.limit === 0) {
					return;
				}

				const bidResponse = pbjs.createBid(1);
				const [width, height] = bid.sizes[0];
				const slotName = bid.adUnitCode;

				bidResponse.bidderCode = bidRequest.bidderCode;
				bidResponse.cpm = this.getPrice();
				bidResponse.creativeId = 'foo123_wikiaVideoCreativeId';
				bidResponse.ttl = 300;
				bidResponse.mediaType = 'video';
				bidResponse.width = width;
				bidResponse.height = height;
				bidResponse.vastUrl = WikiaVideo.getVastUrl(width, height, slotName);
				bidResponse.videoCacheKey = '123foo_wikiaVideoCacheKey';

				addBidResponse(bid.adUnitCode, bidResponse);
				this.limit -= 1;
			}, this.timeout);
		});

		setTimeout(async () => {
			done();
		}, this.timeout + 10);
	}
}

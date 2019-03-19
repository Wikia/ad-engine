import { buildVastUrl, context, utils } from '@wikia/ad-engine';
import { AdUnitConfig, BaseAdapter } from './base-adapter';

const price = utils.queryString.get('wikia_video_adapter');
const limit = parseInt(utils.queryString.get('wikia_adapter_limit'), 10) || 99;
const timeout = parseInt(utils.queryString.get('wikia_adapter_timeout'), 10) || 0;
const useRandomPrice = utils.queryString.get('wikia_adapter_random') === '1';

type CreateInstance = () => WikiaVideo;

export class WikiaVideo extends BaseAdapter {
	static bidderName = 'wikiaVideo';

	static getVastUrl(width, height, slotName): string {
		return buildVastUrl(width / height, slotName, {
			videoAdUnitId: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.videoAdUnitId`),
			customParams: context.get(`bidders.prebid.wikiaVideo.slots.${slotName}.customParams`),
		});
	}

	limit: number;
	useRandomPrice: boolean;
	timeout: number;
	create: CreateInstance;

	get bidderName(): string {
		return WikiaVideo.bidderName;
	}

	constructor(options) {
		super(options);

		this.enabled = !!price;
		this.limit = limit;
		this.useRandomPrice = useRandomPrice;
		this.timeout = timeout;
		this.isCustomBidAdapter = true;

		this.create = () => this;
	}

	prepareConfigForAdUnit(code): AdUnitConfig {
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

	getSpec(): { [key: string]: string | string[] } {
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
		window.pbjs.que.push(() => {
			this.addBids(bidRequest, addBidResponse, done);
		});
	}

	addBids(bidRequest, addBidResponse, done): void {
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
				bidResponse.vastUrl = WikiaVideo.getVastUrl(width, height, slotName);
				bidResponse.videoCacheKey = '123foo_wikiaVideoCacheKey';

				addBidResponse(bid.adUnitCode, bidResponse);
				this.limit -= 1;
			});

			done();
		}, this.timeout);
	}
}

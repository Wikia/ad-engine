// @ts-strict-ignore
import { context, Dictionary, pbjsFactory, utils } from '@ad-engine/core';
import { PrebidNativeConfig } from '../native';
import { PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

const price = utils.queryString.get('wikia_adapter');
const limit = parseInt(utils.queryString.get('wikia_adapter_limit'), 10) || 99;
const timeout = parseInt(utils.queryString.get('wikia_adapter_timeout'), 10) || 100;
const useRandomPrice = utils.queryString.get('wikia_adapter_random') === '1';

export class Wikia extends PrebidAdapter {
	static bidderName = 'wikia';
	limit: number;
	useRandomPrice: boolean;
	timeout: number;

	constructor(options) {
		super(options);

		this.enabled = !!price;
		this.limit = limit;
		this.timeout = timeout;
		this.useRandomPrice = useRandomPrice;
		this.isCustomBidAdapter = true;
	}

	static getCreative(size, cpm): string {
		const creative = document.createElement('div');

		creative.style.background = '#00b7e0';
		creative.style.color = '#fff';
		creative.style.fontFamily = 'sans-serif';
		creative.style.width = `${size[0]}px`;
		creative.style.height = `${size[1]}px`;
		creative.style.textAlign = 'center';

		const title = document.createElement('p');

		title.innerText = 'Wikia Creative';
		title.style.fontWeight = 'bold';
		title.style.margin = '0';
		title.style.paddingTop = '10px';

		const details = document.createElement('small');

		details.innerText = `cpm: ${cpm}, size: ${size.join('x')}`;

		creative.appendChild(title);
		creative.appendChild(details);

		return creative.outerHTML;
	}

	get bidderName(): string {
		return Wikia.bidderName;
	}

	prepareConfigForAdUnit(code, { sizes }: PrebidAdSlotConfig): PrebidAdUnit {
		if (context.get(`slots.${code}.isNative`)) {
			return this.prepareNativeConfig(PrebidNativeConfig.getPrebidNativeTemplate(), code);
		} else {
			return this.prepareStandardConfig(code, { sizes });
		}
	}

	private prepareNativeConfig(template: string, code): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				native: {
					sendTargetingKeys: false,
					adTemplate: template,
					title: {
						required: true,
					},
					body: {
						required: true,
					},
					clickUrl: {
						required: true,
					},
					displayUrl: {
						required: false,
					},
					image: {
						required: false,
						aspect_ratios: [
							{
								min_width: 100,
								min_height: 100,
								ratio_width: 1,
								ratio_height: 1,
							},
						],
					},
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
			bids: [
				{
					bidder: this.bidderName,
					params: {},
				},
			],
		};
	}

	private prepareStandardConfig(code, { sizes }: PrebidAdSlotConfig): PrebidAdUnit {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
				},
			},
			ortb2Imp: this.getOrtb2Imp(code),
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
			supportedMediaTypes: ['banner', 'native'],
		};
	}

	getPrice(): number {
		if (this.useRandomPrice) {
			return Math.floor(Math.random() * 2000) / 100;
		}

		return parseInt(price, 10) / 100;
	}

	callBids(bidRequest, addBidResponse, done): void {
		this.addBids(bidRequest, addBidResponse, done);
	}

	addBids(bidRequest, addBidResponse, done): void {
		setTimeout(async () => {
			const pbjs: Pbjs = await pbjsFactory.init();

			bidRequest.bids.map((bid) => {
				if (this.limit === 0) {
					return;
				}

				addBidResponse(
					bid.adUnitCode,
					bid.mediaTypes.native
						? this.createNativeBidResponse(pbjs, bid, bidRequest)
						: this.createStandardBidResponse(pbjs, bid, bidRequest),
				);

				this.limit -= 1;
			});

			done();
		}, this.timeout);
	}

	private createNativeBidResponse(pbjs, bid, bidRequest) {
		const bidResponse = pbjs.createBid(1);
		const cpm = this.getPrice();

		bidResponse.auctionId = bidRequest.auctionId;
		bidResponse.bidderCode = bidRequest.bidderCode;
		bidResponse.bidderRequestId = bidRequest.bidderRequestId;
		bidResponse.transactionId = bid.transactionId;
		bidResponse.cpm = cpm;
		bidResponse.ttl = 300;
		bidResponse.mediaType = 'native';
		bidResponse.native = {
			body: "Wikia is an old name of Fandom. Haven't heard of Fandom?",
			clickTrackers: ['https://track-click.url'],
			clickUrl: 'https://fandom.com',
			url: 'https://fandom.com',
			image: {
				url: 'https://placekitten.com/100/100',
				height: 100,
				width: 100,
			},
			impressionTrackers: ['https://track-impression.url'],
			title: 'Wikia Native Creative',
		};

		return bidResponse;
	}

	private createStandardBidResponse(pbjs, bid, bidRequest) {
		const bidResponse = pbjs.createBid(1);
		const [width, height] = bid.sizes[0];
		const cpm = this.getPrice();

		bidResponse.ad = Wikia.getCreative(bid.sizes[0], cpm);
		bidResponse.auctionId = bidRequest.auctionId;
		bidResponse.bidderCode = bidRequest.bidderCode;
		bidResponse.bidderRequestId = bidRequest.bidderRequestId;
		bidResponse.transactionId = bid.transactionId;
		bidResponse.cpm = cpm;
		bidResponse.ttl = 300;
		bidResponse.mediaType = 'banner';
		bidResponse.width = width;
		bidResponse.height = height;

		return bidResponse;
	}
}

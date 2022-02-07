import { Dictionary, pbjsFactory, utils } from '@ad-engine/core';
import { EXTENDED_MAX_CPM, PrebidAdapter } from '../prebid-adapter';
import { PrebidAdSlotConfig } from '../prebid-models';

const price = utils.queryString.get('wikia_adapter');
const limit = parseInt(utils.queryString.get('wikia_adapter_limit'), 10) || 99;
const timeout = utils.queryString.get('wikia_adapter_timeout');
const useRandomPrice = utils.queryString.get('wikia_adapter_random') === '1';

export class Wikia extends PrebidAdapter {
	static bidderName = 'wikia';
	limit: number;
	useRandomPrice: boolean;
	timeout: number;
	timeouts: number[] = [];
	maxCpm = EXTENDED_MAX_CPM;

	constructor(options) {
		super(options);

		if (timeout && timeout.indexOf(',')) {
			this.timeouts = timeout.split(',').map((t) => parseInt(t, 10));
		} else {
			this.timeouts.push(parseInt(timeout, 10) || 100);
		}

		this.enabled = !!price;
		this.limit = limit;
		this.useRandomPrice = useRandomPrice;
		this.isCustomBidAdapter = true;
	}

	static getCreative(size, cpm): string {
		const creative = document.createElement('div');

		creative.style.background = '#00b7e0';
		creative.style.color = '#fff';
		creative.style.fontFamily = 'sans-serif';
		creative.style.height = '100%';
		creative.style.textAlign = 'center';
		creative.style.width = '100%';

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
		return {
			code,
			mediaTypes: {
				banner: {
					sizes,
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
			supportedMediaTypes: ['banner'],
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
		const doneTimeout = Math.max(...this.timeouts);

		bidRequest.bids.map((bid) => {
			if (this.timeouts.length) {
				this.timeout = this.timeouts.shift();
			}

			setTimeout(async () => {
				const pbjs: Pbjs = await pbjsFactory.init();

				if (this.limit === 0) {
					return;
				}

				const bidResponse = pbjs.createBid(1);
				const [width, height] = bid.sizes[0];
				const cpm = this.getPrice();

				bidResponse.ad = Wikia.getCreative(bid.sizes[0], cpm);
				bidResponse.bidderCode = bidRequest.bidderCode;
				bidResponse.cpm = cpm;
				bidResponse.ttl = 300;
				bidResponse.mediaType = 'banner';
				bidResponse.width = width;
				bidResponse.height = height;

				addBidResponse(bid.adUnitCode, bidResponse);
				this.limit -= 1;
			}, this.timeout);
		});

		setTimeout(async () => {
			done();
		}, doneTimeout);
	}
}

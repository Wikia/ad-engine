import { BaseAdapter } from './base-adapter';

export class Wikia extends BaseAdapter {
	constructor(options) {
		super(options);

		this.bidderName = 'wikia';
		this.price = options.price;
	}

	prepareConfigForAdUnit(code, { sizes }) {
		return {
			code,
			mediaTypes: {
				banner: {
					sizes
				}
			},
			bids: [
				{
					bidder: this.bidderName
				}
			]
		};
	}

	getCreative(size) {
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

		details.innerText = `price: ${this.price}, ${size}: ${size.join('x')}`;

		creative.appendChild(title);
		creative.appendChild(details);

		return creative.outerHTML;
	}

	addBids(bidRequest, addBidResponse, done) {
		bidRequest.bids.forEach((bid) => {
			const bidResponse = window.pbjs.createBid(1),
				[width, height] = bid.sizes[0];

			bidResponse.ad = this.getCreative(bid.sizes[0]);
			bidResponse.bidderCode = bidRequest.bidderCode;
			bidResponse.cpm = this.price;
			bidResponse.ttl = 300;
			bidResponse.mediaType = 'banner';
			bidResponse.width = width;
			bidResponse.height = height;

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

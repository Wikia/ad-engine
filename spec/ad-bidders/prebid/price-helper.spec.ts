import { expect } from 'chai';
import * as sinon from 'sinon';
import { PrebidBid } from '../../../src/ad-bidders/prebid';
import { BaseAdapter } from '../../../src/ad-bidders/prebid/adapters';
import { adaptersRegistry } from '../../../src/ad-bidders/prebid/adapters-registry';
import {
	getPrebidBestPrice,
	transformPriceFromCpm,
} from '../../../src/ad-bidders/prebid/price-helper';
import { PrebidBidFactory } from './prebid-bid.factory';

describe('transformPriceFromCpm', () => {
	it('should return bucket from price converted to string with two decimal places', () => {
		const testVectors = [
			[0.01, '0.01'],
			[0.02, '0.01'],
			[0.05, '0.05'],

			[0.07, '0.05'],
			[0.1, '0.10'],
			[1.17, '1.15'],
			[4.99, '4.95'],

			[5.47, '5.40'],
			[5.97, '5.90'],
			[9.99, '9.90'],

			[10.01, '10.00'],
			[10.09, '10.00'],
			[10.49, '10.00'],
			[10.99, '10.50'],
			[19.99, '19.50'],

			[20.99, '20.00'],
			[49.99, '49.00'],
			[50.0, '50.00'],
			[51.0, '50.00'],
		];

		testVectors.forEach((vector) => {
			expect(transformPriceFromCpm(vector[0], 50)).to.equal(vector[1]);
		});
	});

	it('should cap to 20 even if maxCpm is lower than 20', () => {
		expect(transformPriceFromCpm(21, 10)).to.equal('20.00');
	});
});

describe('getPrebidBestPrice', () => {
	let bids: PrebidBid[];
	let adapters: Map<string, BaseAdapter>;
	let sandbox;
	const bidderName = 'bidderA';

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		bids = [];
		window.pbjs = {
			getBidResponsesForAdUnitCode() {
				return { bids };
			},
		};
		adapters = new Map();
		sandbox.stub(adaptersRegistry, 'getAdapters').returns(adapters);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should return empty object if window.pbjs does not exist', () => {
		delete window.pbjs;

		const result = getPrebidBestPrice('bidderA');

		expect(result).to.deep.equal({});
	});

	it('should return empty string if there is no price for bidder', () => {
		adapters.set(bidderName, { bidderName } as BaseAdapter);
		bids = [];

		const result = getPrebidBestPrice('bidderA');

		expect(result).to.deep.equal({ [bidderName]: '' });
	});

	it('should round to 2 decimal places', () => {
		adapters.set(bidderName, { bidderName } as BaseAdapter);
		const bid = PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 1 });
		bids = [bid];

		const result = getPrebidBestPrice(bidderName);

		expect(result).to.deep.equal({ [bidderName]: '1.00' });
	});

	it('should not take rendered bids into consideration', () => {
		adapters.set(bidderName, { bidderName } as BaseAdapter);
		const bid = PrebidBidFactory.getBid({ bidderCode: bidderName, status: 'rendered' });
		bids = [bid];

		const result = getPrebidBestPrice(bidderName);

		expect(result).to.deep.equal({ [bidderName]: '' });
	});

	it('should select highest price', () => {
		adapters.set(bidderName, { bidderName } as BaseAdapter);
		bids = [
			PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 1 }),
			PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 0.5 }),
			PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 20 }),
			PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 8 }),
		];

		const result = getPrebidBestPrice(bidderName);

		expect(result).to.deep.equal({ [bidderName]: '20.00' });
	});

	it('should round cpm', () => {
		adapters.set(bidderName, { bidderName } as BaseAdapter);
		bids = [PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 0.03 })];

		let result = getPrebidBestPrice(bidderName);

		expect(result).to.deep.equal({ [bidderName]: '0.01' });

		bids = [PrebidBidFactory.getBid({ bidderCode: bidderName, cpm: 19.99 })];

		result = getPrebidBestPrice(bidderName);

		expect(result).to.deep.equal({ [bidderName]: '19.50' });
	});
});

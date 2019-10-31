import { adaptersRegistry } from '@wikia/ad-bidders/prebid/adapters-registry';
import { DEFAULT_MAX_CPM, PrebidAdapter } from '@wikia/ad-bidders/prebid/prebid-adapter';
import {
	getPrebidBestPrice,
	transformPriceFromBid,
	transformPriceFromCpm,
} from '@wikia/ad-bidders/prebid/price-helper';
import { context } from '@wikia/ad-engine';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { PbjsStub, stubPbjs } from '../../ad-engine/services/pbjs.stub';
import { PrebidBidFactory } from './prebid-bid.factory';

describe('transformPriceFromCpm', () => {
	it('should return bucket from price converted to string with two decimal places', () => {
		const testVectors: [number, string][] = [
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
	let adapters: Map<string, PrebidAdapter>;
	let sandbox: sinon.SinonSandbox;
	let pbjsStub: PbjsStub;
	const bidderName = 'bidderA';

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		pbjsStub = stubPbjs(sandbox).pbjsStub;
		adapters = new Map();
		sandbox.stub(adaptersRegistry, 'getAdapters').returns(adapters);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should return empty string if there is no price for bidder', async () => {
		adapters.set(bidderName, { bidderName } as PrebidAdapter);

		const result = await getPrebidBestPrice('someSlot');

		expect(result).to.deep.equal({ [bidderName]: '' });
	});

	it('should not take rendered bids into consideration', async () => {
		adapters.set(bidderName, { bidderName } as PrebidAdapter);
		const bid = PrebidBidFactory.getBid({ cpm: 0.05, bidderCode: bidderName, status: 'rendered' });

		pbjsStub.getBidResponsesForAdUnitCode.returns({ bids: [bid] });

		const result = await getPrebidBestPrice('someSlot');

		expect(result).to.deep.equal({ [bidderName]: '' });
	});

	it('should select highest price', async () => {
		adapters.set(bidderName, { bidderName } as PrebidAdapter);
		pbjsStub.getBidResponsesForAdUnitCode.returns({
			bids: [
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 1,
					adserverTargeting: { hb_pb: '1.00' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 0.5,
					adserverTargeting: { hb_pb: '0.50' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 20,
					adserverTargeting: { hb_pb: '20.00' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 8,
					adserverTargeting: { hb_pb: '8.00' },
				}),
			],
		});

		const result = await getPrebidBestPrice('someSlot');

		expect(result).to.deep.equal({ [bidderName]: '20.00' });
	});

	it('should select highest price above the floor price', async () => {
		adapters.set(bidderName, { bidderName } as PrebidAdapter);
		pbjsStub.getBidResponsesForAdUnitCode.returns({
			bids: [
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 1,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '1.00' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 0.5,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '0.50' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 2,
					width: 300,
					height: 600,
					adserverTargeting: { hb_pb: '2.00' },
				}),
			],
		});

		context.set('bidders.prebid.priceFloor', { '300x600': 3.5 });

		const result = await getPrebidBestPrice('someSlot');

		expect(result).to.deep.equal({ [bidderName]: '1.00' });
	});

	it('should work correctly with a more complex case (many bidders, rendered slots, no bids)', async () => {
		const otherBidderName = 'bidderB';

		adapters.set(bidderName, { bidderName } as PrebidAdapter);
		adapters.set(otherBidderName, { bidderName: otherBidderName } as PrebidAdapter);
		adapters.set('bidderC', { bidderName: 'bidderC' } as PrebidAdapter);
		pbjsStub.getBidResponsesForAdUnitCode.returns({
			bids: [
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 1.01,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '1.00' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 0.51,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '0.50' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 20,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '20.00' },
					status: 'rendered',
				}),
				PrebidBidFactory.getBid({
					bidderCode: bidderName,
					cpm: 8.01,
					width: 300,
					height: 600,
					adserverTargeting: { hb_pb: '8.00' },
				}),
				PrebidBidFactory.getBid({
					bidderCode: otherBidderName,
					cpm: 2,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '2.00' },
					status: 'rendered',
				}),
				PrebidBidFactory.getBid({
					bidderCode: otherBidderName,
					cpm: 14.01,
					width: 300,
					height: 250,
					adserverTargeting: { hb_pb: '14.00' },
				}),
			],
		});

		context.set('bidders.prebid.priceFloor', { '300x600': 9.5 });

		const result = await getPrebidBestPrice('someSlot');

		expect(result).to.deep.equal({
			[bidderName]: '1.00',
			[otherBidderName]: '14.00',
			bidderC: '',
		});
	});
});

describe('transformPriceFromBid', () => {
	let adapter: PrebidAdapter;
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		adapter = {} as PrebidAdapter;
		sandbox.stub(adaptersRegistry, 'getAdapter').returns(adapter);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it(`should round price to DEFAULT_MAX_CPM (${DEFAULT_MAX_CPM}) if maxCpm is not present on adapter`, () => {
		const result = transformPriceFromBid(PrebidBidFactory.getBid({ cpm: 20.01 }));

		expect(result).to.equal('20.00');
	});

	it('should round price to adapter.maxCpm if present', () => {
		// maxCpm must be greater than 20.
		let result;
		adapter.maxCpm = 10;

		result = transformPriceFromBid(PrebidBidFactory.getBid({ cpm: 20.01 }));
		expect(result).to.equal('20.00');

		result = transformPriceFromBid(PrebidBidFactory.getBid({ cpm: 12.53 }));
		expect(result).to.equal('12.50');

		adapter.maxCpm = 100;

		result = transformPriceFromBid(PrebidBidFactory.getBid({ cpm: 23.01 }));
		expect(result).to.equal('23.00');

		result = transformPriceFromBid(PrebidBidFactory.getBid({ cpm: 140.01 }));
		expect(result).to.equal('100.00');
	});
});

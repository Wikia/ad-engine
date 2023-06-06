import { adaptersRegistry } from '@wikia/ad-bidders/prebid/adapters-registry';
import { PrebidAdapter } from '@wikia/ad-bidders/prebid/prebid-adapter';
import { getPrebidBestPrice } from '@wikia/ad-bidders/prebid/price-helper';
import { context } from '@wikia/core';
import { expect } from 'chai';
import { PbjsStub, stubPbjs } from '../../core/services/pbjs.stub';
import { PrebidBidFactory } from './prebid-bid.factory';

describe('getPrebidBestPrice', () => {
	let adapters: Map<string, PrebidAdapter>;
	let pbjsStub: PbjsStub;
	const bidderName = 'bidderA';

	beforeEach(() => {
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
		adapters = new Map();
		global.sandbox.stub(adaptersRegistry, 'getAdapters').returns(adapters);
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

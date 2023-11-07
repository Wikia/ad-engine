import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { context, TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';
import { stubPbjs } from '../../core/services/pbjs.stub';

const bidderConfig = {
	enabled: false,
};

describe('PrebidProvider bidder', () => {
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		stubPbjs(global.sandbox);
		targetingServiceStub = global.sandbox.stub(targetingService);
	});

	it('can be initialized', () => {
		new PrebidProvider(bidderConfig);
	});

	it('reports as supported', async () => {
		const prebid = new PrebidProvider(bidderConfig);

		await prebid.configureAdUnits([
			{
				code: 'someslot',
				bids: [
					{
						bidder: 'bidder',
						params: {},
					},
				],
			},
		]);

		expect(prebid.isSupported('someslot')).to.be.true;
	});

	describe('getTargetingKeys', () => {
		it('returns all pbjs keys to reset', () => {
			const prebid = new PrebidProvider(bidderConfig);

			targetingServiceStub.dump.returns({
				src: 'foo',
				loc: 'top',
				hb_bidder: 'wikia',
				hb_pb: '20.0',
			});

			const keys = prebid.getTargetingKeys('top_leaderboard');

			expect(keys.length).to.equal(2);
			expect(keys).to.deep.equal(['hb_bidder', 'hb_pb']);
		});
	});

	describe('s2s', () => {
		afterEach(() => {
			context.remove('bidders.s2s.enabled');
			context.remove('bidders.s2s.bidders');
		});

		it('is disabled', () => {
			const prebid = new PrebidProvider(bidderConfig);

			expect(prebid.prebidConfig['s2sConfig']).to.equal(undefined);
		});

		it('is enabled', () => {
			context.set('bidders.s2s.enabled', true);
			context.set('bidders.s2s.bidders', ['test']);
			const prebid = new PrebidProvider(bidderConfig);

			expect(prebid.prebidConfig['s2sConfig']).to.not.equal(undefined);
		});

		it('has correct config', () => {
			context.set('bidders.s2s.enabled', true);
			context.set('bidders.s2s.bidders', ['test', 'test1']);
			const prebid = new PrebidProvider(bidderConfig);

			expect(prebid.prebidConfig['s2sConfig']).to.deep.equal([
				{
					accountId: 7450,
					bidders: ['test', 'test1'],
					defaultVendor: 'rubicon',
					coopSync: true,
					userSyncLimit: 8,
					allowUnknownBidderCodes: true,
					extPrebid: {
						cache: {
							vastxml: { returnCreative: false },
						},
						bidders: {
							test: { wrappername: 'Web_Server' },
							test1: { wrappername: 'Web_Server' },
						},
					},
				},
			]);
		});
	});
});

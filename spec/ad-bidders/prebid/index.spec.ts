import { PrebidProvider } from '@wikia/ad-bidders/prebid';
import { context } from '@wikia/core/services/context-service';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { stubPbjs } from '../../core/services/pbjs.stub';

const bidderConfig = {
	enabled: false,
};

describe('PrebidProvider bidder', () => {
	const sandbox = createSandbox();

	beforeEach(() => {
		stubPbjs(sandbox);
	});

	afterEach(() => {
		sandbox.restore();
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

			context.set('slots.top_leaderboard.targeting', {
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
});

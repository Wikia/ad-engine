import { expect } from 'chai';
import { AdSlot } from '../../../src/ad-engine/models/ad-slot';
import { context } from '../../../src/ad-engine/services/context-service';
import ConfigMock from '../config-mock';

/**
 * Create empty slot with given id.
 *
 * @param {string} id Slot id
 * @returns {AdSlot}
 */
function createAdSlot(id) {
	return new AdSlot({ id });
}

describe('ad-slot', () => {
	beforeEach(() => {
		context.extend(ConfigMock);
	});

	it('base properties', () => {
		const adSlot = createAdSlot('top_leaderboard');

		expect(adSlot.getSlotName()).to.equal('top_leaderboard');
		expect(adSlot.getSizes().length > 0).to.equal(true);
		expect(adSlot.getDefaultSizes().length > 0).to.equal(true);
	});

	it('home ad unit', () => {
		context.set('custom.pageType', 'home');
		const adSlot = createAdSlot('top_leaderboard');

		expect(adSlot.getAdUnit()).to.equal('/5441/something/_home/top_leaderboard');
	});

	it('vertical ad unit', () => {
		context.set('custom.pageType', 'vertical');
		const adSlot = createAdSlot('top_leaderboard');

		expect(adSlot.getAdUnit()).to.equal('/5441/something/_vertical/top_leaderboard');
	});

	it('with article ad unit', () => {
		context.set('custom.pageType', 'article');
		const adSlot = createAdSlot('top_boxad');

		expect(adSlot.getAdUnit()).to.equal('/5441/something/_article/top_boxad');
	});

	it('with other ad unit', () => {
		context.set('custom.pageType', 'other');
		const adSlot = createAdSlot('INVISIBLE_SKIN');

		expect(adSlot.getAdUnit()).to.equal('/5441/something/_other/INVISIBLE_SKIN');
	});

	it('config property getter and setter', () => {
		const adSlot = createAdSlot('top_boxad');

		expect(typeof context.get('slots.top_boxad.foo.bar')).to.equal('undefined');
		expect(typeof adSlot.getConfigProperty('foo.bar')).to.equal('undefined');

		adSlot.setConfigProperty('foo.bar', 'test');

		expect(context.get('slots.top_boxad.foo.bar')).to.equal('test');
		expect(adSlot.getConfigProperty('foo.bar')).to.equal('test');
		expect(adSlot.getConfigProperty('foo')).to.deep.equal({
			bar: 'test',
		});
	});

	describe('updateWinningPbBidderDetails', () => {
		/** @type {AdSlot} */
		let adSlot;
		/** @type {Object} */
		let targeting;

		beforeEach(() => {
			adSlot = createAdSlot('top_leaderboard');
			targeting = {};
			adSlot.config.targeting = targeting;
		});

		it('should have winningBidderDetails set to null initially', () => {
			expect(adSlot.winningBidderDetails).to.be.null;
		});

		it('should set winningBidderDetails if both bidder and bidder price are available', () => {
			targeting.hb_bidder = 'bidder';
			targeting.hb_pb = 20;

			adSlot.updateWinningPbBidderDetails();

			expect(adSlot.winningBidderDetails).to.deep.equal({
				name: targeting.hb_bidder,
				price: targeting.hb_pb,
			});
		});

		it('should not set winningBidderDetails if only bidder is available', () => {
			targeting.hb_bidder = 'bidder';

			adSlot.updateWinningPbBidderDetails(targeting);

			expect(adSlot.winningBidderDetails).to.be.null;
		});

		it('should not set winningBidderDetails if only bidder price is available', () => {
			targeting.hb_pb = 20;

			adSlot.updateWinningPbBidderDetails(targeting);

			expect(adSlot.winningBidderDetails).to.be.null;
		});
	});

	describe('updateWinningA9BidderDetails', () => {
		/** @type {AdSlot} */
		let adSlot;
		/** @type {Object} */
		let targeting;

		beforeEach(() => {
			adSlot = createAdSlot('top_leaderboard');
			targeting = {};
			adSlot.config.targeting = targeting;
		});

		it('should have winningBidderDetails set to null initially', () => {
			expect(adSlot.winningBidderDetails).to.be.null;
		});

		it('should set winningBidderDetails if a9 price is available', () => {
			targeting.amznbid = 'foobar';

			adSlot.updateWinningA9BidderDetails();

			expect(adSlot.winningBidderDetails).to.deep.equal({
				name: 'a9',
				price: targeting.amznbid,
			});
		});

		it('should not set winningBidderDetails if bid price is not available', () => {
			adSlot.updateWinningA9BidderDetails();

			expect(adSlot.winningBidderDetails).to.be.null;
		});
	});
});

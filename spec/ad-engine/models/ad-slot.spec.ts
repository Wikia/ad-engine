import { AdSlot, context, Dictionary } from '@wikia/ad-engine';
import { communicationService, eventsRepository } from '@wikia/communication';
import { assert, expect } from 'chai';
import { createSandbox, SinonSandbox, SinonSpy } from 'sinon';
import { configMock } from '../config-mock';

/**
 * Create empty slot with given id.
 *
 * @param {string} id Slot id
 * @returns {AdSlot}
 */
function createAdSlot(id): AdSlot {
	return new AdSlot({ id });
}

describe('ad-slot', () => {
	const sandbox: SinonSandbox = createSandbox();

	beforeEach(() => {
		context.extend(configMock);
	});

	afterEach(() => {
		sandbox.restore();
		sandbox.reset();
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
		const adSlot = createAdSlot('invisible_high_impact_2');

		expect(adSlot.getAdUnit()).to.equal('/5441/something/_other/invisible_high_impact_2');
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

	it('getCreativeSizeAsArray', () => {
		const adSlot = createAdSlot('top_boxad');

		expect(adSlot.getCreativeSizeAsArray()).to.be.null;

		adSlot.creativeSize = '1x1';
		expect(adSlot.getCreativeSizeAsArray()).to.deep.equal([1, 1]);

		adSlot.creativeSize = [1, 1];
		expect(adSlot.getCreativeSizeAsArray()).to.deep.equal([1, 1]);
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
		let adSlot: AdSlot;
		let targeting: Dictionary;

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

	describe('getTopOffset', () => {
		let adSlot: AdSlot;

		beforeEach(() => {
			adSlot = createAdSlot('top_leaderboard');
		});

		it('should return null if getElement returns null', () => {
			adSlot.getElement = () => null;

			expect(adSlot.getTopOffset()).to.equal(null);
		});
	});

	describe('getSlotsToPushAfterCreated', () => {
		let adSlot: AdSlot;

		beforeEach(() => {
			adSlot = createAdSlot('top_leaderboard');
		});

		afterEach(() => {
			context.remove('events.pushAfterCreated');
		});

		it('should return an empty array if slots are not defined', () => {
			context.remove('events.pushAfterCreated');

			const result = adSlot.getSlotsToPushAfterCreated();

			assert.deepEqual(result, []);
		});

		it('should return slots defined in context at events.pushAfterCreated.top_leaderboard', () => {
			const expectedValue = ['foo', 'bar'];
			context.set('events.pushAfterCreated.top_leaderboard', ['foo', 'bar']);

			const result = adSlot.getSlotsToPushAfterCreated();

			assert.deepEqual(result, expectedValue);
		});
	});

	describe('getSlotsToInjectAfterRendered', () => {
		let adSlot: AdSlot;

		beforeEach(() => {
			adSlot = createAdSlot('top_leaderboard');
		});

		afterEach(() => {
			context.remove('events.pushAfterRendered');
		});

		it('should return an empty array if slots are not defined', () => {
			context.remove('events.pushAfterRendered');

			const result = adSlot.getSlotsToInjectAfterRendered();

			assert.deepEqual(result, []);
		});

		it('should return slots defined in context at events.pushAfterRendered.top_leaderboard', () => {
			const expectedValue = ['foo', 'bar'];
			context.set('events.pushAfterRendered.top_leaderboard', ['foo', 'bar']);

			const result = adSlot.getSlotsToInjectAfterRendered();

			assert.deepEqual(result, expectedValue);
		});
	});

	describe('emit', () => {
		let dispatchSpy: SinonSpy;
		let adSlot: AdSlot;
		const symbol = Symbol('My Symbol');
		const slotName = 'top_leaderboard';

		beforeEach(() => {
			adSlot = createAdSlot(slotName);
			dispatchSpy = sandbox.spy(communicationService, 'dispatch');
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('should call communicationService.dispatch with string event', () => {
			adSlot.emit(AdSlot.TEMPLATES_LOADED, ['foo', 'bar']);

			expect(dispatchSpy.firstCall.args[0]).to.deep.equal(
				communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
					payload: ['foo', 'bar'],
					event: AdSlot.TEMPLATES_LOADED,
					adSlotName: slotName,
					slot: adSlot,
				}),
			);
		});

		it('should call communicationService.dispatch with Symbol event', () => {
			adSlot.emit(symbol, ['foo', 'bar']);

			expect(dispatchSpy.firstCall.args[0]).to.deep.equal(
				communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
					payload: ['foo', 'bar'],
					event: 'Symbol(My Symbol)',
					adSlotName: slotName,
					slot: adSlot,
				}),
			);
		});
	});
});

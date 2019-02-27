import { expect } from 'chai';
import sinon from 'sinon';
import { A9 } from '../../../src/ad-bidders/a9/index';
import { Apstag } from '../../../src/ad-bidders/wrappers';

describe('A9 bidder', () => {
	let bidderConfig;
	let apstagStub;

	beforeEach(() => {
		bidderConfig = {
			slots: {
				top_leaderboard: {
					slotId: 'TOP_LEADERBOARD',
					sizes: [[728, 90]],
				},
				featured: {
					slotId: 'FEATURED',
					type: 'video',
				},
			},
		};

		apstagStub = sinon.stub(Apstag, 'make').returns({});
	});

	afterEach(() => {
		apstagStub.restore();
	});

	it('configure display slot', () => {
		const a9 = new A9(bidderConfig);

		const definition = a9.createSlotDefinition(
			'top_leaderboard',
			bidderConfig.slots.top_leaderboard,
		);

		expect(definition).to.deep.equal({
			slotID: 'TOP_LEADERBOARD',
			slotName: 'TOP_LEADERBOARD',
			sizes: [[728, 90]],
		});
	});

	it('do not configure video slot when video is disabled', () => {
		const a9 = new A9(bidderConfig);

		const definition = a9.createSlotDefinition('featured', bidderConfig.slots.featured);

		expect(definition).to.equal(null);
	});

	it('configure video slot when video is enabled', () => {
		bidderConfig.videoEnabled = true;
		const a9 = new A9(bidderConfig);

		const definition = a9.createSlotDefinition('featured', bidderConfig.slots.featured);

		expect(definition).to.deep.equal({
			mediaType: 'video',
			slotID: 'FEATURED',
			slotName: 'FEATURED',
		});
	});
});

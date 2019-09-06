import { expect } from 'chai';
import * as sinon from 'sinon';
import { A9Provider } from '../../../src/ad-bidders/a9/index';
import { Apstag } from '../../../src/ad-bidders/wrappers';

describe('A9Provider', () => {
	let bidderConfig;
	let apstagStub;

	beforeEach(() => {
		bidderConfig = {
			slots: {
				top_leaderboard: {
					sizes: [[728, 90]],
				},
				featured: {
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
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition(
			'top_leaderboard',
			bidderConfig.slots.top_leaderboard,
		);

		expect(definition).to.deep.equal({
			slotID: 'top_leaderboard',
			slotName: 'top_leaderboard',
			sizes: [[728, 90]],
		});
	});

	it('do not configure video slot when video is disabled', () => {
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition('featured', bidderConfig.slots.featured);

		expect(definition).to.equal(null);
	});

	it('configure video slot when video is enabled', () => {
		bidderConfig.videoEnabled = true;
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition('featured', bidderConfig.slots.featured);

		expect(definition).to.deep.equal({
			mediaType: 'video',
			slotID: 'featured',
			slotName: 'featured',
		});
	});
});

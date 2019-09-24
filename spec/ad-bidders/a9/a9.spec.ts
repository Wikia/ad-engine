import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { A9Provider } from '../../../src/ad-bidders/a9/index';
import { Apstag } from '../../../src/ad-bidders/wrappers';

describe('A9Provider', () => {
	const sandbox = createSandbox();
	let bidderConfig;

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

		sandbox.stub(Apstag, 'make').returns({} as Apstag);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('configure display slot', () => {
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition('top_leaderboard');

		expect(definition).to.deep.equal({
			slotID: 'TOP_LEADERBOARD',
			slotName: 'TOP_LEADERBOARD',
			sizes: [[728, 90]],
		});
	});

	it('do not configure video slot when video is disabled', () => {
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition('featured');

		expect(definition).to.equal(null);
	});

	it('configure video slot when video is enabled', () => {
		bidderConfig.videoEnabled = true;
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition('featured');

		expect(definition).to.deep.equal({
			mediaType: 'video',
			slotID: 'FEATURED',
			slotName: 'FEATURED',
		});
	});
});

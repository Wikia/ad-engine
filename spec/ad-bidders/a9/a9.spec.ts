import { Apstag } from '@wikia/ad-bidders';
import { A9Provider } from '@wikia/ad-bidders/a9';
import { expect } from 'chai';

describe('A9Provider', () => {
	let bidderConfig;

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

		global.sandbox.stub(Apstag, 'make').returns({} as Apstag);
	});

	it('configure display slot', () => {
		const a9 = new A9Provider(bidderConfig);

		const definition = a9.createSlotDefinition('top_leaderboard');

		expect(definition).to.deep.equal({
			slotID: 'top_leaderboard',
			slotName: 'top_leaderboard',
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
			slotID: 'featured',
			slotName: 'featured',
		});
	});
});

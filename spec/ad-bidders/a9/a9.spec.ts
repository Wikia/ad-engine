import { Apstag } from '@wikia/ad-bidders';
import { A9Provider } from '@wikia/ad-bidders/a9';
import { context } from '@wikia/core';
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

	it('should be enabled when matches COPPA requirements and feature flag is turned on', () => {
		const testCases: {
			coppaA9: boolean;
			a9: boolean;
			directedAtChildren: boolean;
			enabled: boolean;
		}[] = [
			{ coppaA9: false, a9: false, directedAtChildren: false, enabled: false },
			{ coppaA9: false, a9: true, directedAtChildren: true, enabled: true },
			{ coppaA9: true, a9: true, directedAtChildren: true, enabled: false },
			{ coppaA9: true, a9: true, directedAtChildren: false, enabled: true },
		];

		testCases.forEach((testCase) => {
			context.set('bidders.coppaA9', testCase.coppaA9);
			context.set('bidders.a9.enabled', testCase.a9);
			context.set('wiki.targeting.directedAtChildren', testCase.directedAtChildren);
			expect(A9Provider.isEnabled()).to.equal(testCase.enabled);
		});
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

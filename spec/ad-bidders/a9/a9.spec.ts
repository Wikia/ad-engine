import { Apstag } from '@wikia/ad-bidders';
import { A9Provider } from '@wikia/ad-bidders/a9';
import { context, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStub } from 'sinon';

// TODO: fixme, fix A9Provider tests, add Apstag tests as well
describe('A9Provider', () => {
	let bidderConfig;

	beforeEach(() => {
		bidderConfig = {
			amazonId: 12345,
			slots: {
				top_leaderboard: {
					sizes: [[728, 90]],
				},
				featured: {
					type: 'video',
				},
			},
		};
	});

	describe('isEnabled', () => {
		beforeEach(() => {
			global.sandbox.stub(Apstag, 'make').returns({} as Apstag);
		});

		afterEach(() => {
			window.fandomContext.partners.directedAtChildren = undefined;
		});

		it('should be enabled when matches COPPA requirements and feature flag is turned on', () => {
			const testCases: {
				a9: boolean;
				directedAtChildren: boolean;
				enabled: boolean;
			}[] = [
				{ a9: false, directedAtChildren: false, enabled: false },
				{ a9: true, directedAtChildren: true, enabled: false },
				{ a9: true, directedAtChildren: false, enabled: true },
			];

			testCases.forEach((testCase) => {
				context.set('bidders.a9.enabled', testCase.a9);
				window.fandomContext.partners.directedAtChildren = testCase.directedAtChildren;

				expect(A9Provider.isEnabled()).to.equal(testCase.enabled);
			});
		});
	});

	describe('createSlotDefinition', () => {
		beforeEach(() => {
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

	describe('getA9SlotsDefinitions', () => {
		beforeEach(() => {
			global.sandbox.stub(Apstag, 'make').returns({} as Apstag);
		});

		it('should return empty array when no slots are configured', () => {
			const a9 = new A9Provider({
				...bidderConfig,
				slots: {},
			});

			const definitions = a9.getA9SlotsDefinitions(['top_leaderboard']);

			expect(definitions).to.have.length(0);
		});

		it('should return configured slots', () => {
			const a9 = new A9Provider(bidderConfig);

			const definitions = a9.getA9SlotsDefinitions(Object.keys(bidderConfig.slots));

			expect(definitions).to.have.length(1);
		});
	});

	describe('init', () => {
		let apstagInitStub: SinonStub;
		let apstagFetchBids: SinonStub;

		beforeEach(() => {
			apstagInitStub = global.sandbox.stub(Apstag.prototype, 'init');
			apstagFetchBids = global.sandbox.stub(Apstag.prototype, 'fetchBids');
			global.sandbox.stub(Apstag, 'make').returns({
				init: apstagInitStub as any,
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				onRenderImpEnd: (_: any) => {},
				fetchBids: apstagFetchBids as any,
			} as Apstag);
			targetingService.set('openrtb2', {}, 'openrtb2');
		});

		// it('should initialize Apstag with config and fetch bids', () => {
		// 	const a9 = new A9Provider(bidderConfig);
		//
		// 	a9.init();
		//
		// 	expect(
		// 		apstagInitStub.calledOnceWithExactly({
		// 			pubID: bidderConfig.amazonId,
		// 			videoAdServer: 'DFP',
		// 			deals: true,
		// 			signals: { ortb2: {} },
		// 		}),
		// 	).to.equal(true, 'init called with wrong arguments');
		// 	expect(
		// 		apstagFetchBids.calledOnceWithExactly({
		// 			slots: a9.getA9SlotsDefinitions(Object.keys(bidderConfig.slots)),
		// 			timeout: DEFAULT_MAX_DELAY,
		// 		}),
		// 	).to.equal(true, 'fetchBids called with wrong arguments');
		// });

		// it('should initialize Apstag with CCPA config and fetch bids', () => {
		// 	const a9 = new A9Provider(bidderConfig);
		//
		// 	a9.init();
		//
		// 	expect(
		// 		apstagInitStub.calledOnceWithExactly({
		// 			pubID: bidderConfig.amazonId,
		// 			videoAdServer: 'DFP',
		// 			deals: true,
		// 			params: { us_privacy: '1---' },
		// 			signals: { ortb2: {} },
		// 		}),
		// 	).to.equal(true, 'init called with wrong arguments');
		// 	expect(
		// 		apstagFetchBids.calledOnceWithExactly({
		// 			slots: a9.getA9SlotsDefinitions(Object.keys(bidderConfig.slots)),
		// 			timeout: DEFAULT_MAX_DELAY,
		// 		}),
		// 	).to.equal(true, 'fetchBids called with wrong arguments');
		// });
	});
});

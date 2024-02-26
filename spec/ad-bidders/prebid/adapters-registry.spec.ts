import { defaultSlotBidGroup } from '@wikia/ad-bidders/bidder-helper';
import { adaptersRegistry } from '@wikia/ad-bidders/prebid/adapters-registry';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('AdaptersRegistry', () => {
	let prebidContext;

	beforeEach(() => {
		prebidContext = context.get('bidders.prebid');
		context.remove('bidders.prebid');

		context.set('bidders.prebid', {
			indexExchange: {
				enabled: true,
				slots: {
					fandom_dt_galleries: {
						sizes: [[0, 0]],
					},
					top_leaderboard: {
						sizes: [[0, 0]],
					},
				},
			},
		});

		context.set('slots.fandom_dt_galleries.bidGroup', 'gallery');
	});

	afterEach(() => {
		context.remove('bidders.prebid');
		context.set('slots', prebidContext);
	});

	it('result if gallery group', () => {
		const expected = [
			{
				bids: [
					{
						bidder: 'indexExchange',
						params: {
							siteId: undefined,
							size: [0, 0],
						},
					},
				],
				code: 'fandom_dt_galleries',
				mediaTypes: {
					banner: {
						sizes: [[0, 0]],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '',
					},
				},
			},
		];
		context.set('slotConfig.slotRefresher', {
			sizes: {
				gallery: [0, 0],
			},
		});
		const result = adaptersRegistry.setupAdUnits('gallery');
		expect(expected).to.deep.equal(result);
	});

	it('result if default group', () => {
		const expected = [
			{
				bids: [
					{
						bidder: 'indexExchange',
						params: {
							siteId: undefined,
							size: [0, 0],
						},
					},
				],
				code: 'top_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [[0, 0]],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '',
					},
				},
			},
		];

		const result = adaptersRegistry.setupAdUnits(defaultSlotBidGroup);
		expect(expected).to.deep.equal(result);
	});
});

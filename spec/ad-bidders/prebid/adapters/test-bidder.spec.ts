import { TestBidder } from '@wikia/ad-bidders/prebid/adapters';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('TestBidder bidder adapter', () => {
	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled', () => {
		const testBidder = new TestBidder({
			enabled: true,
		});
		expect(testBidder.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const testBidder = new TestBidder({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					parameters: {
						custom: 'parameter',
					},
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(testBidder.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [
							[300, 250],
							[320, 50],
						],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/bottom_leaderboard',
					},
				},
				bids: [
					{
						bidder: 'testBidder',
						params: {
							custom: 'parameter',
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape for video', () => {
		global.sandbox
			.stub(context, 'get')
			.withArgs('slots.bottom_leaderboard.isVideo')
			.returns(true)
			.withArgs('adUnitId')
			.returns('/5441/something/_{custom.pageType}/{slotConfig.adProduct}')
			.withArgs('custom.pageType')
			.returns('PB');

		const testBidder = new TestBidder({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					parameters: {
						custom: 'parameter',
					},
					sizes: [
						[300, 250],
						[320, 50],
					],
				},
			},
		});

		expect(testBidder.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/bottom_leaderboard',
					},
				},
				bids: [
					{
						bidder: 'testBidder',
						params: {
							custom: 'parameter',
						},
					},
				],
			},
		]);
	});
});

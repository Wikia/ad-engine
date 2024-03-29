import { Wikia } from '@wikia/ad-bidders/prebid/adapters/wikia';
import { context } from '@wikia/core';
import { assert, expect } from 'chai';
import { stubPbjs } from '../../../core/services/pbjs.stub';

describe('Wikia bidder adapter', () => {
	beforeEach(() => {
		stubPbjs(global.sandbox);
	});

	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
	});

	it('can be enabled only via query parameter', () => {
		const wikia = new Wikia({
			enabled: true,
		});

		expect(wikia.enabled).to.equal(false);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const wikia = new Wikia({
			enabled: true,
			slots: {
				mobile_top_leaderboard: {
					sizes: [[320, 50]],
				},
			},
		});

		expect(wikia.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_top_leaderboard',
				mediaTypes: {
					banner: {
						sizes: [[320, 50]],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/mobile_top_leaderboard',
					},
				},
				bids: [
					{
						bidder: 'wikia',
						params: {},
					},
				],
			},
		]);
	});

	it('calls addBiddResponse callback with correct properties', (done) => {
		const wikia = new Wikia({
			enabled: true,
			slots: {
				top_leaderboard: {},
			},
		});
		const bidRequest = {
			auctionId: 'fake-id',
			bidderCode: 'fake-wikia-bidder',
			bidderRequestId: 'fake-request-id',
			bids: [
				{
					adUnitCode: 'fake-ad-unit',
					sizes: [[728, 90]],
					mediaTypes: {
						banner: {},
					},
					transactionId: 'fake-transaction-id',
				},
			],
		};
		const responseCpm = 20;
		const responseAd =
			'<div style="background: rgb(0, 183, 224); color: rgb(255, 255, 255); font-family: sans-serif; width: 728px; height: 90px; text-align: center;"><p style="font-weight: bold; margin: 0px; padding-top: 10px;"></p><small></small></div>';
		const clock = global.sandbox.useFakeTimers();
		const addBidResponseSpy = global.sandbox.spy();

		global.sandbox.stub(wikia, 'getPrice').returns(responseCpm);

		wikia.addBids(bidRequest, addBidResponseSpy, () => {
			assert.ok(addBidResponseSpy.called);
			expect(addBidResponseSpy.args[0]).to.deep.equal([
				'fake-ad-unit',
				{
					ad: responseAd,
					auctionId: 'fake-id',
					bidderCode: 'fake-wikia-bidder',
					bidderRequestId: 'fake-request-id',
					transactionId: 'fake-transaction-id',
					cpm: responseCpm,
					ttl: 300,
					mediaType: 'banner',
					width: 728,
					height: 90,
				},
			]);
			done();
		});
		clock.next();
	});
});

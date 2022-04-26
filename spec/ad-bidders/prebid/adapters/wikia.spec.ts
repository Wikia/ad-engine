import { Wikia } from '@wikia/ad-bidders/prebid/adapters/wikia';
import { assert, expect } from 'chai';
import { createSandbox } from 'sinon';
import { stubPbjs } from '../../../ad-engine/services/pbjs.stub';

describe('Wikia bidder adapter', () => {
	const sandbox = createSandbox();

	beforeEach(() => {
		stubPbjs(sandbox);
	});

	afterEach(() => {
		sandbox.restore();
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
			bidderCode: 'fake-wikia-bidder',
			auctionId: 'fake-id',
			bids: [
				{
					adUnitCode: 'fake-ad-unit',
					sizes: [[728, 90]],
				},
			],
		};
		const responseCpm = 20;
		const responseAd =
			'<div style="background: rgb(0, 183, 224); color: rgb(255, 255, 255); font-family: sans-serif; height: 100%; text-align: center; width: 100%;"><p style="font-weight: bold; margin: 0px; padding-top: 10px;"></p><small></small></div>';
		const clock = sandbox.useFakeTimers();
		const addBidResponseSpy = sandbox.spy();

		sandbox.stub(wikia, 'getPrice').returns(responseCpm);

		wikia.addBids(bidRequest, addBidResponseSpy, () => {
			assert.ok(addBidResponseSpy.called);
			expect(addBidResponseSpy.args[0]).to.deep.equal([
				'fake-ad-unit',
				{
					ad: responseAd,
					bidderCode: 'fake-wikia-bidder',
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

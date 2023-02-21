import { Freewheel } from '@wikia/ad-bidders/prebid/adapters/freewheel';
import { assert, expect } from 'chai';
import { createSandbox } from 'sinon';
import { stubPbjs } from '../../../core/services/pbjs.stub';

describe('Freewheel bidder adapter', () => {
	const sandbox = createSandbox();

	beforeEach(() => {
		stubPbjs(sandbox);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('can be enabled only via query parameter', () => {
		const freewheel = new Freewheel({
			enabled: true,
		});

		expect(freewheel.enabled).to.equal(false);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const freewheel = new Freewheel({
			enabled: true,
			slots: {
				featured: {},
			},
		});

		expect(freewheel.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'freewheel-ssp',
						labelAll: ['desktop'],
						params: {
							maxPlayerSize: [1800, 1000],
							minPlayerSize: [100, 200],
							zoneId: 32563810,
						},
					},
					{
						bidder: 'freewheel-ssp',
						labelAll: ['phone'],
						params: {
							maxPlayerSize: [600, 350],
							minPlayerSize: [300, 50],
							zoneId: 32563826,
						},
					},
				],
			},
		]);
	});

	it('calls addBiddResponse callback with correct properties', (done) => {
		const freewheel = new Freewheel({
			enabled: true,
			slots: {
				featured: {},
			},
		});
		const bidRequest = {
			bidderCode: 'fake-wikia-video-bidder',
			auctionId: 'fake-id',
			bids: [
				{
					adUnitCode: 'fake-ad-unit',
					sizes: [[640, 480]],
				},
			],
		};
		const clock = sandbox.useFakeTimers();
		const addBidResponseSpy = sandbox.spy();

		sandbox.stub(Freewheel, 'getVastUrl').returns('https://fake-vast-url');
		sandbox.stub(freewheel, 'getPrice').returns(20);

		freewheel.addBids(bidRequest, addBidResponseSpy, () => {
			assert.ok(addBidResponseSpy.called);
			expect(addBidResponseSpy.args[0]).to.deep.equal([
				'fake-ad-unit',
				{
					bidderCode: 'fake-freewheel-bidder',
					cpm: 20,
					creativeId: 'foo123_freewheelCreativeId',
					ttl: 300,
					mediaType: 'video',
					width: 640,
					height: 480,
					vastUrl: 'https://fake-vast-url',
					videoCacheKey: '123foo_freewheelCacheKey',
				},
			]);
			done();
		});
		clock.next();
	});
});

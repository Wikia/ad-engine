import { WikiaVideo } from '@wikia/ad-bidders/prebid/adapters/wikia-video';
import { assert, expect } from 'chai';
import { stubPbjs } from '../../../core/services/pbjs.stub';

describe('WikiaVideo bidder adapter', () => {
	beforeEach(() => {
		stubPbjs(global.sandbox);
	});

	it('can be enabled only via query parameter', () => {
		const wikiaVideo = new WikiaVideo({
			enabled: true,
		});

		expect(wikiaVideo.enabled).to.equal(false);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const wikiaVideo = new WikiaVideo({
			enabled: true,
			slots: {
				featured: {},
			},
		});

		expect(wikiaVideo.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						context: 'outstream',
						playerSize: [640, 480],
					},
				},
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/featured',
					},
				},
				bids: [
					{
						bidder: 'wikiaVideo',
						params: {},
					},
				],
			},
		]);
	});

	it('calls addBiddResponse callback with correct properties', (done) => {
		const wikiaVideo = new WikiaVideo({
			enabled: true,
			slots: {
				featured: {},
			},
		});
		const bidRequest = {
			auctionId: 'fake-id',
			bidderCode: 'fake-wikia-video-bidder',
			bidderRequestId: 'fake-request-id',
			bids: [
				{
					adUnitCode: 'fake-ad-unit',
					transactionId: 'fake-transaction-id',
					sizes: [[640, 480]],
				},
			],
		};
		const clock = global.sandbox.useFakeTimers();
		const addBidResponseSpy = global.sandbox.spy();

		global.sandbox.stub(WikiaVideo, 'getVastUrl').returns('https://fake-vast-url');
		global.sandbox.stub(wikiaVideo, 'getPrice').returns(20);

		wikiaVideo.addBids(bidRequest, addBidResponseSpy, () => {
			assert.ok(addBidResponseSpy.called);
			expect(addBidResponseSpy.args[0]).to.deep.equal([
				'fake-ad-unit',
				{
					auctionId: 'fake-id',
					bidderCode: 'fake-wikia-video-bidder',
					bidderRequestId: 'fake-request-id',
					transactionId: 'fake-transaction-id',
					cpm: 20,
					creativeId: 'foo123_wikiaVideoCreativeId',
					ttl: 300,
					mediaType: 'video',
					width: 640,
					height: 480,
					vastUrl: 'https://fake-vast-url',
					videoCacheKey: '123foo_wikiaVideoCacheKey',
				},
			]);
			done();
		});
		clock.next();
	});
});

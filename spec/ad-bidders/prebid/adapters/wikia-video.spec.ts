import { WikiaVideo } from '@wikia/ad-bidders/prebid/adapters/wikia-video';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';

function getMocks() {
	const mocks = {
		addBidResponseMock: sinon.spy(),
		bidsRequestMock: {
			bidderCode: 'fake-wikia-video-bidder',
			auctionId: 'fake-id',
			bids: [
				{
					adUnitCode: 'fake-ad-unit',
					sizes: [[640, 480]],
				},
			],
		},
		fakeVastUrl: 'https://fake-vast-url',
		fakePrice: 20,
		done() {},
		setTimeout(cb) {
			cb();
		},
		pbjs: {
			que: [],
			createBid() {
				return {};
			},
		},
	};

	return mocks;
}

describe('WikiaVideo bidder adapter', () => {
	let originalPbjs;

	before(() => {
		const mocks = getMocks();

		originalPbjs = global.window.pbjs;
		global.window.pbjs = mocks.pbjs;
	});

	after(() => {
		global.window.pbjs = originalPbjs;
	});

	it('can be enabled', () => {
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
				bids: [
					{
						bidder: 'wikiaVideo',
					},
				],
			},
		]);
	});

	it('calls addBiddResponse callback with correct properties', () => {
		const wikiaVideo = new WikiaVideo({
			enabled: true,
			slots: {
				featured: {},
			},
		});
		const mocks = getMocks();

		sinon.stub(global, 'setTimeout').callsFake(mocks.setTimeout);
		sinon.stub(WikiaVideo, 'getVastUrl').returns(mocks.fakeVastUrl);
		sinon.stub(wikiaVideo, 'getPrice').returns(mocks.fakePrice);

		wikiaVideo.addBids(mocks.bidsRequestMock, mocks.addBidResponseMock, mocks.done);
		assert.ok(mocks.addBidResponseMock.called);
		expect(mocks.addBidResponseMock.args[0]).to.deep.equal([
			'fake-ad-unit',
			{
				bidderCode: 'fake-wikia-video-bidder',
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
	});
});

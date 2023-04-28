import { OneVideo } from '@wikia/ad-bidders/prebid/adapters';
import { expect } from 'chai';

describe('OneVideo bidder adapter', () => {
	it('can be enabled', () => {
		const oneVideo = new OneVideo({
			enabled: true,
		});
		expect(oneVideo.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const oneVideo = new OneVideo({
			enabled: true,
			slots: {
				bottom_leaderboard: {
					pubId: '123456',
					site: 'site',
				},
			},
		});

		expect(oneVideo.prepareAdUnits()).to.deep.equal([
			{
				code: 'bottom_leaderboard',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
						context: 'instream',
					},
				},
				bids: [
					{
						bidder: 'oneVideo',
						params: {
							site: 'site',
							pubId: '123456',
							video: {
								playerWidth: 640,
								playerHeight: 480,
								mimes: [
									'video/mp4',
									'application/javascript',
									'video/x-flv',
									'video/webm',
									'video/ogg',
								],
								protocols: [2, 3, 5, 6],
								delivery: [2],
								api: [2],
							},
						},
					},
				],
			},
		]);
	});
});

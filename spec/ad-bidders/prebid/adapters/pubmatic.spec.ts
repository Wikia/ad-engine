import { expect } from 'chai';
import { Pubmatic } from '../../../../src/ad-bidders/prebid/adapters/pubmatic';

describe('Pubmatic bidder adapter', () => {
	it('can be enabled', () => {
		const pubmatic = new Pubmatic({
			enabled: true,
		});

		expect(pubmatic.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const pubmatic = new Pubmatic({
			enabled: true,
			publisherId: '112233',
			slots: {
				mobile_in_content: {
					sizes: [[300, 250], [320, 480]],
					ids: [
						'/1234/MOBILE_IN_CONTENT_300x250@300x250',
						'/1234/MOBILE_IN_CONTENT_320x480@320x480',
					],
				},
			},
		});

		expect(pubmatic.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					banner: {
						sizes: [[300, 250], [320, 480]],
					},
				},
				bids: [
					{
						bidder: 'pubmatic',
						params: {
							adSlot: '/1234/MOBILE_IN_CONTENT_300x250@300x250',
							publisherId: '112233',
						},
					},
					{
						bidder: 'pubmatic',
						params: {
							adSlot: '/1234/MOBILE_IN_CONTENT_320x480@320x480',
							publisherId: '112233',
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for video returns data in correct shape', () => {
		const pubmatic = new Pubmatic({
			enabled: true,
			publisherId: '112233',
			slots: {
				featured: {
					sizes: [[0, 0]],
					ids: ['1636187@0x0'],
				},
			},
		});

		expect(pubmatic.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
						context: 'instream',
					},
				},
				bids: [
					{
						bidder: 'pubmatic',
						params: {
							adSlot: '1636187@0x0',
							publisherId: '112233',
							video: {
								mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
								skippable: true,
								minduration: 1,
								maxduration: 30,
								startdelay: 0,
								playbackmethod: [2, 3],
								protocols: [2, 3, 5, 6],
								linearity: 1,
								placement: 1,
							},
						},
					},
				],
			},
		]);
	});
});
